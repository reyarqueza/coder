import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { EditorView } from "@codemirror/view";
import { workspaceSyntax } from "@/lib/workspace/colors";

export const webcontainerEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    color: "var(--workspace-fg)",
    backgroundColor: "var(--workspace-bg)",
  },
  ".cm-scroller": {
    overflowX: "hidden",
    overflowY: "auto",
    flex: "1 1 auto",
    minHeight: 0,
    height: "100%",
    maxHeight: "100%",
    scrollbarGutter: "stable",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--workspace-font-size)",
    lineHeight: "var(--workspace-line-height)",
  },
  ".cm-content": {
    caretColor: "var(--workspace-cursor)",
    padding: "4px 0",
  },
  ".cm-line": {
    padding: "0 2px 0 6px",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--workspace-cursor)",
  },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
    {
      backgroundColor: "var(--workspace-selection)",
    },
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "none",
    color: "var(--workspace-fg-muted)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "var(--workspace-fg-active)",
  },
  ".cm-activeLine": {
    backgroundColor: "var(--workspace-active-line)",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    backgroundColor: "var(--workspace-bg-hover)",
  },
});

export const webcontainerHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: workspaceSyntax.keyword },
  { tag: [t.controlKeyword, t.moduleKeyword], color: workspaceSyntax.keyword },
  { tag: t.comment, color: workspaceSyntax.comment },
  { tag: [t.string, t.special(t.string), t.inserted], color: workspaceSyntax.string },
  {
    tag: [
      t.variableName,
      t.definition(t.variableName),
      t.propertyName,
      t.definition(t.propertyName),
      t.special(t.variableName),
    ],
    color: workspaceSyntax.identifier,
  },
  {
    tag: [
      t.function(t.variableName),
      t.function(t.propertyName),
      t.labelName,
      t.tagName,
    ],
    color: workspaceSyntax.function,
  },
  { tag: [t.number, t.changed, t.annotation], color: workspaceSyntax.number },
  { tag: [t.bool, t.null, t.atom], color: workspaceSyntax.interpolation },
  { tag: [t.className, t.typeName, t.namespace], color: workspaceSyntax.type },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.punctuation,
      t.separator,
      t.bracket,
      t.paren,
      t.squareBracket,
      t.brace,
    ],
    color: workspaceSyntax.punctuation,
  },
  { tag: [t.meta, t.processingInstruction], color: workspaceSyntax.interpolation },
  { tag: t.invalid, color: "#f44747" },
]);

export const webcontainerTheme = [
  webcontainerEditorTheme,
  syntaxHighlighting(webcontainerHighlightStyle),
];
