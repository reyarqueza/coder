import type { EditorView } from "@codemirror/view";
import type { Plugin } from "prettier";

type FormatParser = "babel" | "typescript" | "json" | "css" | "html";

type FormatConfig = {
  parser: FormatParser;
};

function getExtension(path: string): string {
  const dot = path.lastIndexOf(".");
  if (dot === -1) return "";
  return path.slice(dot).toLowerCase();
}

export function getFormatSupport(path: string): FormatConfig | null {
  const ext = getExtension(path);

  switch (ext) {
    case ".js":
    case ".jsx":
    case ".mjs":
    case ".cjs":
      return { parser: "babel" };
    case ".ts":
    case ".tsx":
      return { parser: "typescript" };
    case ".json":
      return { parser: "json" };
    case ".css":
      return { parser: "css" };
    case ".html":
    case ".htm":
      return { parser: "html" };
    default:
      return null;
  }
}

type PrettierModule = typeof import("prettier/standalone");

let prettierPromise: Promise<PrettierModule> | null = null;
const pluginCache = new Map<FormatParser, Plugin[]>();

function loadPrettier(): Promise<PrettierModule> {
  prettierPromise ??= import("prettier/standalone");
  return prettierPromise;
}

async function loadPlugins(parser: FormatParser): Promise<Plugin[]> {
  const cached = pluginCache.get(parser);
  if (cached) return cached;

  let plugins: Plugin[];

  switch (parser) {
    case "babel":
    case "json": {
      const [babel, estree] = await Promise.all([
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
      ]);
      plugins = [babel, estree];
      break;
    }
    case "typescript": {
      const [typescript, estree] = await Promise.all([
        import("prettier/plugins/typescript"),
        import("prettier/plugins/estree"),
      ]);
      plugins = [typescript, estree];
      break;
    }
    case "css": {
      const postcss = await import("prettier/plugins/postcss");
      plugins = [postcss];
      break;
    }
    case "html": {
      const html = await import("prettier/plugins/html");
      plugins = [html];
      break;
    }
  }

  pluginCache.set(parser, plugins);
  return plugins;
}

export type FormatResult = { ok: true } | { ok: false; error: string };

export async function formatEditorDocument(
  view: EditorView,
  path: string,
): Promise<FormatResult> {
  const support = getFormatSupport(path);
  if (!support) {
    return { ok: false, error: "Formatting not supported for this file type." };
  }

  const doc = view.state.doc.toString();
  const cursorOffset = view.state.selection.main.head;

  try {
    const prettier = await loadPrettier();
    const plugins = await loadPlugins(support.parser);

    const { formatted, cursorOffset: newCursor } = await prettier.formatWithCursor(
      doc,
      {
        parser: support.parser,
        plugins,
        tabWidth: 2,
        useTabs: false,
        cursorOffset,
      },
    );

    if (formatted === doc) {
      return { ok: true };
    }

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: formatted },
      selection: { anchor: newCursor },
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to format document.",
    };
  }
}
