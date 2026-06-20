"use client";

import { useEffect, useRef } from "react";
import { Synth } from "beepbox";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DASHBOARD_SONG } from "@/lib/beepbox/dashboard-song";

type DashboardMusicPlayerProps = {
  playing: boolean;
  started: boolean;
  onPlayingChange: (playing: boolean) => void;
  onStartedChange: (started: boolean) => void;
};

export function DashboardMusicPlayer({
  playing,
  started,
  onPlayingChange,
  onStartedChange,
}: DashboardMusicPlayerProps) {
  const synthRef = useRef<Synth | null>(null);

  useEffect(() => {
    const synth = new Synth(DASHBOARD_SONG);
    synthRef.current = synth;

    return () => {
      synth.pause();
      synthRef.current = null;
    };
  }, []);

  function handleStart() {
    const synth = synthRef.current;
    if (!synth) return;

    synth.play();
    onStartedChange(true);
    onPlayingChange(true);
  }

  function handleTogglePlayPause() {
    const synth = synthRef.current;
    if (!synth || !started) return;

    if (synth.playing) {
      synth.pause();
      onPlayingChange(false);
    } else {
      synth.play();
      onPlayingChange(true);
    }
  }

  return (
    <>
      <Button
        type="button"
        disabled={started}
        onClick={handleStart}
        className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
      >
        Start
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={!started}
        onClick={handleTogglePlayPause}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Pause /> : <Play />}
      </Button>
    </>
  );
}
