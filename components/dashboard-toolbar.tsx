"use client";

import dynamic from "next/dynamic";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";

const DashboardMusicPlayer = dynamic(
  () =>
    import("@/components/dashboard-music-player").then(
      (mod) => mod.DashboardMusicPlayer,
    ),
  { ssr: false },
);

export function DashboardToolbar() {
  return (
    <FieldSet className="w-fit">
      <FieldLegend variant="label">Start Coder Bahamuto NOW!</FieldLegend>
      <FieldGroup className="flex-row gap-2">
        <DashboardMusicPlayer />
      </FieldGroup>
    </FieldSet>
  );
}
