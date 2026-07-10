import type {
  CodingQuestion,
  ReactPreviewValidation,
  QuestionValidation,
} from "@/lib/questions/types";
import { isReactPreviewValidation } from "@/lib/questions/types";
import type { WebContainer } from "@webcontainer/api";
import type { NodeRunResult } from "@/lib/webcontainer/run-node-file";

export type ValidateAnswerResult =
  | { ok: true }
  | { ok: false; message: string };

function getLastNonEmptyLine(output: string): string {
  const lines = output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.at(-1) ?? "";
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => deepEqual(value, b[index]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
    );
  }
  return false;
}

function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

function normalizeNodeInspectToJson(text: string): string {
  return text
    .replace(/(\{|,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
    .replace(/'/g, '"');
}

function extractBracketBlock(text: string, open: string, close: string): string | null {
  const start = text.indexOf(open);
  const end = text.lastIndexOf(close);
  if (start === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

function parseSingleLineOutput(line: string): unknown {
  const cleaned = stripAnsi(line).trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
      const normalized = cleaned.replace(/'/g, '"');
      try {
        return JSON.parse(normalized);
      } catch {
        const matches = [...cleaned.matchAll(/'([^']*)'|"([^"]*)"/g)];
        if (matches.length > 0) {
          return matches.map((match) => match[1] ?? match[2] ?? "");
        }
      }
    }
  }

  throw new Error(`Unrecognized output format: ${cleaned}`);
}

function parseStdoutValue(stdout: string): unknown {
  const cleaned = stripAnsi(stdout).trim();
  if (!cleaned) {
    throw new Error("No output found.");
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // fall through
  }

  try {
    return parseSingleLineOutput(getLastNonEmptyLine(cleaned));
  } catch {
    // fall through
  }

  for (const [open, close] of [
    ["[", "]"],
    ["{", "}"],
  ] as const) {
    const block = extractBracketBlock(cleaned, open, close);
    if (!block) continue;

    try {
      return JSON.parse(normalizeNodeInspectToJson(block));
    } catch {
      // fall through
    }
  }

  throw new Error(`Unrecognized output format: ${cleaned}`);
}

function compareJson(stdout: string, expectedStdout: string): ValidateAnswerResult {
  const cleaned = stripAnsi(stdout).trim();
  if (!cleaned) {
    return { ok: false, message: "No output found. Use console.log to print your answer." };
  }

  let actual: unknown;
  let expected: unknown;

  try {
    actual = parseStdoutValue(stdout);
  } catch {
    return {
      ok: false,
      message: `Could not parse output: ${getLastNonEmptyLine(cleaned) || cleaned}`,
    };
  }

  try {
    expected = JSON.parse(expectedStdout);
  } catch {
    return { ok: false, message: "Invalid expected answer configuration." };
  }

  if (!deepEqual(actual, expected)) {
    return {
      ok: false,
      message: `Expected ${expectedStdout}, but got ${cleaned}.`,
    };
  }

  return { ok: true };
}

function compareTrim(stdout: string, expectedStdout: string): ValidateAnswerResult {
  const actual = getLastNonEmptyLine(stdout);
  const expected = expectedStdout.trim();

  if (!actual) {
    return { ok: false, message: "No output found. Use console.log to print your answer." };
  }

  if (actual !== expected) {
    return {
      ok: false,
      message: `Expected "${expected}", but got "${actual}".`,
    };
  }

  return { ok: true };
}

function stripComments(content: string): string {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

function stripImportLines(content: string): string {
  return content.replace(/^import\s+.+$/gm, "");
}

/** Code body only — excludes imports and comments so scaffolds cannot false-pass. */
export function getReactValidationSource(content: string): string {
  return stripImportLines(stripComments(content));
}

export async function validateReactPreview(
  webcontainer: WebContainer,
  validation: ReactPreviewValidation,
): Promise<ValidateAnswerResult> {
  for (const check of validation.checks) {
    if (check.kind === "file-contains") {
      let content: string;
      try {
        content = await webcontainer.fs.readFile(check.path, "utf-8");
      } catch {
        return {
          ok: false,
          message: `File not found: ${check.path}. Make sure your Vite app is set up at ${validation.appDir}.`,
        };
      }

      const source = getReactValidationSource(content);

      for (const pattern of check.patterns) {
        if (!source.includes(pattern)) {
          return {
            ok: false,
            message: `Expected to find "${pattern}" in ${check.path}.`,
          };
        }
      }
    }
  }

  return { ok: true };
}

export function validateStdoutAnswer(
  validation: QuestionValidation,
  result: NodeRunResult,
): ValidateAnswerResult {
  if (result.exitCode !== 0) {
    return {
      ok: false,
      message: result.stderr
        ? `Runtime error: ${result.stderr}`
        : `Process exited with code ${result.exitCode}.`,
    };
  }

  if (isReactPreviewValidation(validation)) {
    return { ok: false, message: "Invalid validation configuration." };
  }

  const normalize = validation.normalize ?? "trim";

  if (normalize === "json") {
    return compareJson(result.stdout, validation.expectedStdout);
  }

  return compareTrim(result.stdout, validation.expectedStdout);
}

export function validateAnswer(
  question: CodingQuestion,
  result: NodeRunResult,
): ValidateAnswerResult {
  return validateStdoutAnswer(question.validation, result);
}
