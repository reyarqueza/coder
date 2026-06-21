"use client";

import { useEffect, useState } from "react";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";
import { WorkspacePanel } from "@/components/workspace/workspace-panel";

export function PreviewPanel() {
  const { webcontainer, status } = useWebContainer();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!webcontainer || status !== "ready") return;

    const offServerReady = webcontainer.on("server-ready", (_port, url) => {
      setPreviewUrl(url);
      setPreviewError(null);
    });

    const offPreviewMessage = webcontainer.on("preview-message", (message) => {
      if (
        message.type === "PREVIEW_UNCAUGHT_EXCEPTION" ||
        message.type === "PREVIEW_UNHANDLED_REJECTION"
      ) {
        setPreviewError(message.message);
      }
    });

    return () => {
      offServerReady();
      offPreviewMessage();
    };
  }, [webcontainer, status]);

  if (status !== "ready") {
    return (
      <div className="flex h-full min-h-0 items-center justify-center text-sm text-muted-foreground">
        Preview will appear once the environment is ready.
      </div>
    );
  }

  return (
    <WorkspacePanel
      title="Preview"
      bodyClassName="relative min-h-0 bg-[#16181d]"
      headerExtra={
        previewError ? (
          <span className="max-w-[50%] truncate text-xs text-red-400">
            {previewError}
          </span>
        ) : null
      }
    >
      {previewUrl ? (
        <iframe
          src={previewUrl}
          title="Preview"
          className="workspace-preview-frame"
        />
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center p-4 text-center text-sm text-zinc-500">
          Starting dev server…
        </div>
      )}
    </WorkspacePanel>
  );
}
