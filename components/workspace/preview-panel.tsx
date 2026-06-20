"use client";

import { useEffect, useState } from "react";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";

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
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Preview will appear once the environment is ready.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2 text-xs text-muted-foreground">
        <span>Preview</span>
        {previewError ? (
          <span className="truncate text-destructive">{previewError}</span>
        ) : null}
      </div>
      {previewUrl ? (
        <iframe
          src={previewUrl}
          title="Preview"
          className="min-h-0 flex-1 border-0 bg-background"
        />
      ) : (
        <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
          Starting dev server…
        </div>
      )}
    </div>
  );
}
