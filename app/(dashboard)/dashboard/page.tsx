"use client";

import { Suspense } from "react";
import { DashboardIde } from "@/components/dashboard-ide";
import { DashboardToolbar } from "@/components/dashboard-toolbar";

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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b p-4">
        <DashboardToolbar />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <DashboardIde />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
