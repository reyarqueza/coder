import {
  defaultKeymap,
  history,
  historyKeymap,
} from "@codemirror/commands";
import { syntaxHighlighting } from "@codemirror/language";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { EditorState, type Extension } from "@codemirror/state";
import {
  EditorView,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import {
  webcontainerHighlightStyle,
  webcontainerTheme,
} from "@/lib/codemirror/webcontainer-theme";

function getLanguageExtension(path: string) {
  if (path.endsWith(".json")) return json();
  if (path.endsWith(".css")) return css();
  if (path.endsWith(".html") || path.endsWith(".htm")) return html();
  return javascript();
}

export function baseEditorExtensions(path: string): Extension[] {
  return [
    lineNumbers(),
    highlightActiveLine(),
    highlightSpecialChars(),
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    ...webcontainerTheme,
    getLanguageExtension(path),
    EditorView.lineWrapping,
  ];
}

export function createEditorState(
  doc: string,
  path: string,
  extraExtensions: Extension[] = [],
) {
  return EditorState.create({
    doc,
    extensions: [...baseEditorExtensions(path), ...extraExtensions],
  });
}

export const QUESTION_CODE_FONT_SIZE_PX = 16;
export const QUESTION_EXAMPLE_FONT_SIZE = `${QUESTION_CODE_FONT_SIZE_PX}px`;
export const QUESTION_EXAMPLE_LINE_HEIGHT = "1.5";

const questionExampleEditorTheme = EditorView.theme({
  "&": {
    color: "var(--workspace-fg)",
    backgroundColor: "var(--workspace-bg)",
    fontFamily: "var(--font-mono)",
    fontSize: QUESTION_EXAMPLE_FONT_SIZE,
    lineHeight: QUESTION_EXAMPLE_LINE_HEIGHT,
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    fontSize: QUESTION_EXAMPLE_FONT_SIZE,
    lineHeight: QUESTION_EXAMPLE_LINE_HEIGHT,
  },
  ".cm-content": {
    fontSize: QUESTION_EXAMPLE_FONT_SIZE,
    lineHeight: QUESTION_EXAMPLE_LINE_HEIGHT,
    padding: "0",
  },
  ".cm-line": {
    padding: "0 2px 0 6px",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "none",
    color: "var(--workspace-fg-muted)",
    fontSize: QUESTION_EXAMPLE_FONT_SIZE,
    lineHeight: QUESTION_EXAMPLE_LINE_HEIGHT,
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "var(--workspace-fg-active)",
  },
  ".cm-activeLine": {
    backgroundColor: "var(--workspace-active-line)",
  },
});

export function createQuestionExampleEditorState(
  doc: string,
  extraExtensions: Extension[] = [],
  options?: { lineNumbers?: boolean },
) {
  const showLineNumbers = options?.lineNumbers !== false;

  return EditorState.create({
    doc,
    extensions: [
      ...(showLineNumbers ? [lineNumbers()] : []),
      highlightActiveLine(),
      highlightSpecialChars(),
      syntaxHighlighting(webcontainerHighlightStyle),
      questionExampleEditorTheme,
      javascript(),
      EditorView.lineWrapping,
      EditorState.readOnly.of(true),
      EditorView.editable.of(false),
      ...extraExtensions,
    ],
  });
}

export function createReadonlyEditorState(
  doc: string,
  path: string,
  extraExtensions: Extension[] = [],
) {
  return EditorState.create({
    doc,
    extensions: [
      lineNumbers(),
      highlightActiveLine(),
      highlightSpecialChars(),
      ...webcontainerTheme,
      getLanguageExtension(path),
      EditorView.lineWrapping,
      EditorState.readOnly.of(true),
      EditorView.editable.of(false),
      ...extraExtensions,
    ],
  });
}
