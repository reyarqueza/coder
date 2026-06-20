"use client";

import { useState } from "react";
import { DashboardBahamutoDancer } from "@/components/dashboard-bahamuto-dancer";
import { DashboardMusicPlayer } from "@/components/dashboard-music-player";
import { FieldLegend, FieldSet } from "@/components/ui/field";

export function DashboardToolbar() {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <FieldSet className="w-full">
      <FieldLegend variant="label">Start Coder Bahamuto NOW!</FieldLegend>
      <div className="flex w-full items-end gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <DashboardMusicPlayer
            started={started}
            playing={playing}
            onStartedChange={setStarted}
            onPlayingChange={setPlaying}
          />
        </div>
        <DashboardBahamutoDancer started={started} playing={playing} />
      </div>
    </FieldSet>
  );
}
