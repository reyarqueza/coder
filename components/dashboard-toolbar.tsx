"use client";

import { useEffect, useState } from "react";
import { DashboardBahamutoDancer } from "@/components/dashboard-bahamuto-dancer";
import { DashboardCheckAnswer } from "@/components/dashboard-check-answer";
import {
  CHALLENGE_DURATION_SECONDS,
  DashboardChallengeTimer,
} from "@/components/dashboard-challenge-timer";
import { DashboardMusicPlayer } from "@/components/dashboard-music-player";
import { DashboardQuestionPrompt } from "@/components/dashboard-question-prompt";
import { FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { getDefaultQuestion } from "@/lib/questions/catalog";
import { seedQuestionStarterFile } from "@/lib/questions/starter-files";
import { primeTypewriterAudio, setTypewriterAudioEnabled } from "@/lib/beepbox/play-typewriter-blip";
import {
  playFailureSound,
  playSuccessSound,
  primeSuccessAudio,
} from "@/lib/beepbox/play-outcome-sound";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";
import { useWorkspaceReady } from "@/components/workspace/workspace-ready-provider";

type DashboardToolbarProps = {
  started: boolean;
  onStartedChange: (started: boolean) => void;
};

export function DashboardToolbar({
  started,
  onStartedChange,
}: DashboardToolbarProps) {
  const { workspaceReady } = useWorkspaceReady();
  const { webcontainer, status, setSelectedPath, refreshFiles } =
    useWebContainer();
  const [questionStarted, setQuestionStarted] = useState(false);
  const [questionDisplayed, setQuestionDisplayed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [solutionComplete, setSolutionComplete] = useState(false);
  const [failed, setFailed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    CHALLENGE_DURATION_SECONDS,
  );
  const question = getDefaultQuestion();

  function setAudioPlaying(nextPlaying: boolean) {
    setTypewriterAudioEnabled(nextPlaying);
    setPlaying(nextPlaying);
  }

  function handleFail() {
    if (failed || solutionComplete) return;

    playFailureSound();
    setFailed(true);
    setAudioPlaying(false);
  }

  function handleSuccess() {
    if (failed || solutionComplete) return;

    playSuccessSound();
    setSolutionComplete(true);
    setAudioPlaying(false);
  }

  useEffect(() => {
    if (!started || solutionComplete || failed) return;

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          handleFail();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [started, solutionComplete, failed]);

  async function handleStartQuestion() {
    primeTypewriterAudio();
    primeSuccessAudio();
    setQuestionStarted(true);
  }

  async function handleBegin() {
    if (!webcontainer || status !== "ready") return;

    primeSuccessAudio();

    const starterPath = await seedQuestionStarterFile(webcontainer, question);
    if (starterPath) {
      refreshFiles();
      setSelectedPath(starterPath);
    }
  }

  return (
    <FieldSet className="w-full">
      <DashboardQuestionPrompt
        active={questionStarted}
        question={question}
        onComplete={() => setQuestionDisplayed(true)}
      />
      <div className="flex w-full items-end gap-4">
        <div className="flex shrink-0 items-end gap-2">
          {!questionStarted ? (
            <Button
              type="button"
              disabled={status !== "ready"}
              onClick={() => void handleStartQuestion()}
            >
              Start
            </Button>
          ) : null}
          <DashboardMusicPlayer
            started={started}
            playing={playing}
            showBegin={questionDisplayed}
            onStartedChange={onStartedChange}
            onPlayingChange={setAudioPlaying}
            onBegin={handleBegin}
          />
          {started ? (
            <DashboardCheckAnswer
              question={question}
              enabled={workspaceReady}
              disabled={failed || solutionComplete}
              onCorrect={handleSuccess}
              onIncorrect={handleFail}
            />
          ) : null}
          <DashboardChallengeTimer
            active={started}
            expired={failed}
            secondsRemaining={secondsRemaining}
          />
          {failed ? (
            <span className="inline-flex h-8 shrink-0 items-center text-[length:calc(2rem-10px)] font-black leading-none tracking-wider text-red-500">
              FAIL
            </span>
          ) : null}
          {solutionComplete ? (
            <span className="inline-flex h-8 shrink-0 items-center text-[length:calc(2rem-10px)] font-black leading-none tracking-wider text-green-500">
              SUCCESS
            </span>
          ) : null}
        </div>
        <DashboardBahamutoDancer
          started={started}
          playing={playing && !failed && !solutionComplete}
          failed={failed}
          succeeded={solutionComplete}
        />
      </div>
    </FieldSet>
  );
}
