"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightSpecialChars,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
} from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";

function getLanguageExtension(path: string) {
  if (path.endsWith(".json")) return json();
  if (path.endsWith(".css")) return css();
  if (path.endsWith(".html") || path.endsWith(".htm")) return html();
  return javascript();
}

export function CodeEditor() {
  const { webcontainer, status, selectedPath } = useWebContainer();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !webcontainer || !selectedPath || status !== "ready") {
      return;
    }

    let cancelled = false;

    async function loadEditor() {
      const contents = await webcontainer!.fs.readFile(selectedPath!, "utf-8");
      if (cancelled || !containerRef.current) return;

      viewRef.current?.destroy();

      const view = new EditorView({
        parent: containerRef.current,
        state: EditorState.create({
          doc: contents,
          extensions: [
            lineNumbers(),
            highlightActiveLine(),
            highlightSpecialChars(),
            history(),
            keymap.of([...defaultKeymap, ...historyKeymap]),
            getLanguageExtension(selectedPath!),
            EditorView.lineWrapping,
            EditorView.updateListener.of((update) => {
              if (!update.docChanged) return;

              if (saveTimeoutRef.current !== null) {
                window.clearTimeout(saveTimeoutRef.current);
              }

              saveTimeoutRef.current = window.setTimeout(() => {
                void webcontainer!.fs.writeFile(
                  selectedPath!,
                  update.state.doc.toString(),
                );
              }, 300);
            }),
          ],
        }),
      });

      viewRef.current = view;
    }

    void loadEditor();

    return () => {
      cancelled = true;
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [webcontainer, selectedPath, status]);

  if (status !== "ready") {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        {status === "booting"
          ? "Booting environment…"
          : status === "installing"
            ? "Installing dependencies…"
            : "Environment unavailable."}
      </div>
    );
  }

  if (!selectedPath) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Select a file from the sidebar to start editing.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b px-3 py-2 text-xs text-muted-foreground">
        {selectedPath}
      </div>
      <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden" />
    </div>
  );
}
