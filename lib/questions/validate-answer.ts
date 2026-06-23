import type { CodingQuestion } from "@/lib/questions/types";
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

function parseOutputValue(line: string): unknown {
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

function compareJson(stdout: string, expectedStdout: string): ValidateAnswerResult {
  const actualLine = getLastNonEmptyLine(stdout);
  if (!actualLine) {
    return { ok: false, message: "No output found. Use console.log to print your answer." };
  }

  let actual: unknown;
  let expected: unknown;

  try {
    actual = parseOutputValue(actualLine);
  } catch {
    return {
      ok: false,
      message: `Could not parse output: ${stripAnsi(actualLine)}`,
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
      message: `Expected ${expectedStdout}, but got ${stripAnsi(actualLine)}.`,
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

export function validateAnswer(
  question: CodingQuestion,
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

  const { validation } = question;
  const normalize = validation.normalize ?? "trim";

  if (normalize === "json") {
    return compareJson(result.stdout, validation.expectedStdout);
  }

  return compareTrim(result.stdout, validation.expectedStdout);
}
