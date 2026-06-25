"use client";

import { useEffect, useRef } from "react";
import { Synth } from "beepbox";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DASHBOARD_SONG } from "@/lib/beepbox/dashboard-song";

type DashboardMusicPlayerProps = {
  playing: boolean;
  started: boolean;
  showBegin?: boolean;
  resetKey: number;
  onPlayingChange: (playing: boolean) => void;
  onStartedChange: (started: boolean) => void;
  onBegin?: () => void | Promise<void>;
};

export function DashboardMusicPlayer({
  playing,
  started,
  showBegin = false,
  resetKey,
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
    if (!synth) return;

    synth.snapToStart();
    synth.pause();
  }, [resetKey]);

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
    if (!synth) return;

    const nextPlaying = !playing;
    onPlayingChange(nextPlaying);

    if (started) {
      if (nextPlaying) {
        synth.play();
      } else {
        synth.pause();
      }
    }
  }

  return (
    <>
      {showBegin && !started ? (
        <Button
          type="button"
          onClick={() => void handleBegin()}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Begin
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleToggleMute}
        aria-label={playing ? "Mute audio" : "Unmute audio"}
      >
        {playing ? <VolumeX /> : <Volume2 />}
      </Button>
    </>
  );
}
