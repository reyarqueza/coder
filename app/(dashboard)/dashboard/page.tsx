"use client";

import { Suspense } from "react";
import { DashboardIde } from "@/components/dashboard-ide";
import { DashboardToolbar } from "@/components/dashboard-toolbar";
import { WorkspaceReadyProvider } from "@/components/workspace/workspace-ready-provider";

function DashboardFallback() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b p-4">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <WorkspaceReadyProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b p-4">
          <DashboardToolbar />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DashboardIde />
        </div>
      </div>
    </WorkspaceReadyProvider>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
