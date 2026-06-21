"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { createEditorState } from "@/lib/codemirror/editor-setup";
import {
  formatEditorDocument,
  getFormatSupport,
} from "@/lib/codemirror/format-document";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";
import { WorkspacePanel } from "@/components/workspace/workspace-panel";
import { WorkspaceToolbarTooltip } from "@/components/workspace/workspace-toolbar-tooltip";
import { workspaceUi } from "@/lib/workspace/colors";

function getFileName(path: string) {
  return path.split("/").pop() ?? path;
}

export function CodeEditor() {
  const { webcontainer, status, selectedPath } = useWebContainer();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const savedContentRef = useRef<string>("");
  const [isDirty, setIsDirty] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);

  const canFormat = selectedPath ? getFormatSupport(selectedPath) !== null : false;

  useEffect(() => {
    setFormatError(null);
  }, [selectedPath]);

  const handleFormat = useCallback(async () => {
    const view = viewRef.current;
    if (!view || !selectedPath || !canFormat || isFormatting) return;

    setFormatError(null);
    setIsFormatting(true);

    try {
      const result = await formatEditorDocument(view, selectedPath);
      if (!result.ok) {
        setFormatError(result.error);
      }
    } finally {
      setIsFormatting(false);
    }
  }, [canFormat, isFormatting, selectedPath]);

  useEffect(() => {
    if (!containerRef.current || !webcontainer || !selectedPath || status !== "ready") {
      return;
    }

    let cancelled = false;

    async function loadEditor() {
      const contents = await webcontainer!.fs.readFile(selectedPath!, "utf-8");
      if (cancelled || !containerRef.current) return;

      savedContentRef.current = contents;
      setIsDirty(false);
      viewRef.current?.destroy();

      const view = new EditorView({
        parent: containerRef.current,
        state: createEditorState(contents, selectedPath!, [
          EditorView.updateListener.of((update) => {
            if (!update.docChanged) return;

            const nextContent = update.state.doc.toString();
            setIsDirty(nextContent !== savedContentRef.current);

            if (saveTimeoutRef.current !== null) {
              window.clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = window.setTimeout(() => {
              void webcontainer!.fs.writeFile(selectedPath!, nextContent).then(() => {
                savedContentRef.current = nextContent;
                setIsDirty(false);
              });
            }, 300);
          }),
        ]),
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      viewRef.current?.requestMeasure();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedPath, status]);

  if (status !== "ready") {
    return (
      <div className="flex h-full min-h-0 items-center justify-center text-sm text-muted-foreground">
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
      <WorkspacePanel title="Editor" bodyClassName={workspaceUi.bg}>
        <div
          className={cn(
            "flex min-h-0 flex-1 items-center justify-center text-sm",
            workspaceUi.textMuted,
          )}
        >
          Select a file from the sidebar to start editing.
        </div>
      </WorkspacePanel>
    );
  }

  return (
    <WorkspacePanel
      title={getFileName(selectedPath)}
      statusDot={isDirty}
      headerExtra={
        <div className="flex items-center gap-0.5">
          <WorkspaceToolbarTooltip
            label={
              canFormat
                ? "Format document"
                : "Formatting not supported for this file type"
            }
          >
            <span
              className={cn(
                "inline-flex",
                (!canFormat || isFormatting) && "cursor-not-allowed",
              )}
            >
              <button
                type="button"
                disabled={!canFormat || isFormatting}
                className={cn(
                  "rounded p-1",
                  workspaceUi.textMuted,
                  workspaceUi.bgHover,
                  workspaceUi.hoverText,
                  (!canFormat || isFormatting) && "pointer-events-none opacity-50",
                )}
                onClick={() => void handleFormat()}
              >
                <WandSparkles className="size-3.5" />
              </button>
            </span>
          </WorkspaceToolbarTooltip>
        </div>
      }
      bodyClassName={cn(workspaceUi.bg, "relative min-h-0")}
    >
      {formatError ? (
        <p className={cn("shrink-0 border-b px-3 py-1.5 text-xs", workspaceUi.headerBorder, workspaceUi.textError)}>
          {formatError}
        </p>
      ) : null}
      <div ref={containerRef} className="workspace-editor-host min-h-0 flex-1" />
    </WorkspacePanel>
  );
}
