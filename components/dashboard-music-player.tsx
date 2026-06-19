"use client";

import { useEffect, useRef, useState } from "react";
import { Synth } from "beepbox";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DASHBOARD_SONG } from "@/lib/beepbox/dashboard-song";

export function DashboardMusicPlayer() {
  const synthRef = useRef<Synth | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

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
    setStarted(true);
    setPlaying(true);
  }

  function handleTogglePlayPause() {
    const synth = synthRef.current;
    if (!synth || !started) return;

    if (synth.playing) {
      synth.pause();
      setPlaying(false);
    } else {
      synth.play();
      setPlaying(true);
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
