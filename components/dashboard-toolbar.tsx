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
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import {
  getQuestionAtIndex,
  hasNextQuestion,
  isLastQuestion,
} from "@/lib/questions/catalog";
import { seedQuestionStarterFile } from "@/lib/questions/starter-files";
import { primeTypewriterAudio, setTypewriterAudioEnabled } from "@/lib/beepbox/play-typewriter-blip";
import {
  playFailureSound,
  playSuccessSound,
  primeSuccessAudio,
} from "@/lib/beepbox/play-outcome-sound";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";
import { useWorkspaceReady } from "@/components/workspace/workspace-ready-provider";
import { cn } from "@/lib/utils";

type DashboardToolbarProps = {
  started: boolean;
  onStartedChange: (started: boolean) => void;
  onCorrect: () => void;
  onShowResults: () => void;
};

export function DashboardToolbar({
  started,
  onStartedChange,
  onCorrect,
  onShowResults,
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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const question = getQuestionAtIndex(questionIndex);
  const showNext =
    (failed || solutionComplete) && hasNextQuestion(questionIndex);
  const showFinalResult =
    (failed || solutionComplete) && isLastQuestion(questionIndex);
  const showStartButton = questionIndex === 0 && !questionStarted;

  useEffect(() => {
    setTypewriterAudioEnabled(playing);
  }, [playing]);

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
    onCorrect();
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

    const starterPath = await seedQuestionStarterFile(webcontainer, question, {
      force: true,
    });
    if (starterPath) {
      refreshFiles();
      setSelectedPath(starterPath);
    }
  }

  function handleNext() {
    if (!hasNextQuestion(questionIndex)) return;

    const nextIndex = questionIndex + 1;

    setQuestionIndex(nextIndex);
    setQuestionDisplayed(false);
    setFailed(false);
    setSolutionComplete(false);
    setSecondsRemaining(CHALLENGE_DURATION_SECONDS);
    setAudioPlaying(true);
    onStartedChange(false);
    setSelectedPath(null);
    setSessionKey((current) => current + 1);

    if (nextIndex > 0) {
      primeTypewriterAudio();
      primeSuccessAudio();
      setQuestionStarted(true);
    } else {
      setQuestionStarted(false);
    }
  }

  function handleShowFinalResult() {
    setAudioPlaying(false);
    onStartedChange(false);
    setSelectedPath(null);
    setSessionKey((current) => current + 1);
    onShowResults();
  }

  return (
    <FieldSet className="w-full">
      <DashboardQuestionPrompt
        key={`${question.id}-${sessionKey}`}
        active={questionStarted}
        question={question}
        onComplete={() => setQuestionDisplayed(true)}
      />
      <div className="flex w-full items-end gap-4">
        <div className="flex shrink-0 items-end gap-2">
          {!showStartButton ? null : (
            <Button
              type="button"
              disabled={status !== "ready"}
              onClick={() => void handleStartQuestion()}
            >
              Start
            </Button>
          )}
          <DashboardMusicPlayer
            started={started}
            playing={playing}
            showBegin={questionDisplayed}
            resetKey={sessionKey}
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
            <span
              className={cn(
                pressStart2P.className,
                "inline-flex h-8 shrink-0 items-center text-[length:calc(2rem-10px)] leading-none tracking-wider text-red-500",
              )}
            >
              FAIL
            </span>
          ) : null}
          {solutionComplete ? (
            <span
              className={cn(
                pressStart2P.className,
                "inline-flex h-8 shrink-0 items-center text-[length:calc(2rem-10px)] leading-none tracking-wider text-green-500",
              )}
            >
              SUCCESS
            </span>
          ) : null}
          {showNext ? (
            <Button type="button" onClick={() => handleNext()}>
              Next
            </Button>
          ) : null}
          {showFinalResult ? (
            <Button type="button" onClick={() => handleShowFinalResult()}>
              Final Result
            </Button>
          ) : null}
        </div>
        <DashboardBahamutoDancer
          started={started}
          playing={playing && !failed && !solutionComplete}
          failed={failed}
          succeeded={solutionComplete}
          resetKey={sessionKey}
        />
      </div>
    </FieldSet>
  );
}
