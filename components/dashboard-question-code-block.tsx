"use client";

import { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { createQuestionExampleEditorState } from "@/lib/codemirror/editor-setup";
import { scrollParentOnWheelExtension } from "@/lib/codemirror/scroll-parent-wheel";
import { cn } from "@/lib/utils";

const questionCodeLayoutTheme = EditorView.theme({
  "&": {
    height: "auto",
    maxHeight: "none",
    overflow: "hidden",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--workspace-border)",
  },
  ".cm-scroller": {
    overflow: "hidden",
    height: "auto",
    maxHeight: "none",
  },
});

function syncEditorHeight(view: EditorView) {
  view.requestMeasure();
  view.dom.style.height = `${view.contentHeight}px`;
}

type DashboardQuestionCodeBlockProps = {
  content: string;
  className?: string;
  lineNumbers?: boolean;
};

export function DashboardQuestionCodeBlock({
  content,
  className,
  lineNumbers = true,
}: DashboardQuestionCodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      parent: containerRef.current,
      state: createQuestionExampleEditorState(
        content,
        [questionCodeLayoutTheme, scrollParentOnWheelExtension()],
        { lineNumbers },
      ),
    });

    syncEditorHeight(view);
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [lineNumbers]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const current = view.state.doc.toString();
    if (current === content) return;

    view.dispatch({
      changes: { from: 0, to: current.length, insert: content },
    });
    syncEditorHeight(view);
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "question-code-block my-4 min-w-0 overflow-hidden text-[16px] leading-normal",
        className,
      )}
      aria-label="Example code"
    />
  );
}
