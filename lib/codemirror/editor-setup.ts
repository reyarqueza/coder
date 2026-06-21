import {
  defaultKeymap,
  history,
  historyKeymap,
} from "@codemirror/commands";
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
import { webcontainerTheme } from "@/lib/codemirror/webcontainer-theme";

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
