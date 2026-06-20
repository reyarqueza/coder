"use client";

import { WorkspacePanels } from "@/components/workspace/workspace-panels";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";

export function DashboardIde() {
  const { status, error } = useWebContainer();

  if (status === "error") {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md space-y-2 text-center">
          <h2 className="text-lg font-semibold">IDE unavailable</h2>
          <p className="text-sm text-muted-foreground">
            {error ?? "WebContainer failed to start."}
          </p>
          <p className="text-xs text-muted-foreground">
            Use a Chromium-based browser and reload the page. For production,
            configure `NEXT_PUBLIC_WEBCONTAINER_API_KEY`.
          </p>
        </div>
      </div>
    );
  }

  return <WorkspacePanels />;
}
