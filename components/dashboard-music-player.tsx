"use client";

import { useEffect, useRef } from "react";
import { Synth } from "beepbox";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DASHBOARD_SONG } from "@/lib/beepbox/dashboard-song";

type DashboardMusicPlayerProps = {
  playing: boolean;
  started: boolean;
  onPlayingChange: (playing: boolean) => void;
  onStartedChange: (started: boolean) => void;
  onBegin?: () => void | Promise<void>;
};

export function DashboardMusicPlayer({
  playing,
  started,
  onPlayingChange,
  onStartedChange,
  onBegin,
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

  useEffect(() => {
    const synth = synthRef.current;
    if (!synth || !started) return;

    if (playing) {
      synth.play();
    } else {
      synth.pause();
    }
  }, [playing, started]);

  async function handleBegin() {
    const synth = synthRef.current;
    if (!synth) return;

    await onBegin?.();
    synth.play();
    onStartedChange(true);
    onPlayingChange(true);
  }

  function handleToggleMute() {
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
        onClick={() => void handleBegin()}
        className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
      >
        Begin
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={!started}
        onClick={handleToggleMute}
        aria-label={playing ? "Mute music" : "Unmute music"}
      >
        {playing ? <VolumeX /> : <Volume2 />}
      </Button>
    </>
  );
}
