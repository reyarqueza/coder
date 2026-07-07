"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardBahamutoDancer } from "@/components/dashboard-bahamuto-dancer";
import { DashboardCheckAnswer } from "@/components/dashboard-check-answer";
import { DashboardChallengeMinutesControl } from "@/components/dashboard-challenge-minutes-control";
import { DashboardChallengeTimer } from "@/components/dashboard-challenge-timer";
import { DashboardMusicPlayer } from "@/components/dashboard-music-player";
import { DashboardQuestionPrompt } from "@/components/dashboard-question-prompt";
import { DashboardQuestionSolutionReveal } from "@/components/dashboard-question-solution-reveal";
import { FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import {
  getQuestionAtIndex,
  getTotalQuestionCount,
  hasNextQuestion,
  isLastQuestion,
} from "@/lib/questions/catalog";
import { seedQuestionStarterFile } from "@/lib/questions/starter-files";
import { primeTypewriterAudio, setTypewriterAudioEnabled } from "@/lib/beepbox/play-typewriter-blip";
import {
  delayAfterFailureSound,
  playFailureSound,
  playSuccessSound,
  primeSuccessAudio,
} from "@/lib/beepbox/play-outcome-sound";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";
import { useWorkspaceReady } from "@/components/workspace/workspace-ready-provider";
import { challengeMinutesToSeconds } from "@/lib/challenge/constants";
import { cn } from "@/lib/utils";

type DashboardToolbarProps = {
  initialChallengeMinutes: number;
  started: boolean;
  onStartedChange: (started: boolean) => void;
  onCorrect: () => void;
  onShowResults: () => void;
  onFailedChange?: (failed: boolean) => void;
};

export function DashboardToolbar({
  initialChallengeMinutes,
  started,
  onStartedChange,
  onCorrect,
  onShowResults,
  onFailedChange,
}: DashboardToolbarProps) {
  const { workspaceReady } = useWorkspaceReady();
  const { webcontainer, status, setSelectedPath, refreshFiles } =
    useWebContainer();
  const [questionStarted, setQuestionStarted] = useState(false);
  const [questionDisplayed, setQuestionDisplayed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [solutionComplete, setSolutionComplete] = useState(false);
  const [failed, setFailed] = useState(false);
  const [solutionRevealReady, setSolutionRevealReady] = useState(false);
  const [challengeMinutes, setChallengeMinutes] = useState(
    initialChallengeMinutes,
  );
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    challengeMinutesToSeconds(initialChallengeMinutes),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const failSequenceRef = useRef(0);
  const question = getQuestionAtIndex(questionIndex);
  const showNext =
    (failed || solutionComplete) && hasNextQuestion(questionIndex);
  const showFinalResult =
    (failed || solutionComplete) && isLastQuestion(questionIndex);
  const showStartButton = questionIndex === 0 && !questionStarted;
  const challengeActive = started && !failed && !solutionComplete;

  useEffect(() => {
    if (!started) {
      setSecondsRemaining(challengeMinutesToSeconds(challengeMinutes));
    }
  }, [challengeMinutes, started]);

  function setAudioPlaying(nextPlaying: boolean) {
    setTypewriterAudioEnabled(nextPlaying);
    setPlaying(nextPlaying);
  }

  function handleFail() {
    if (failed || solutionComplete) return;

    playFailureSound();
    setFailed(true);
    setSolutionRevealReady(false);
    onFailedChange?.(true);
    setPlaying(false);

    const failSequence = ++failSequenceRef.current;
    void delayAfterFailureSound().then(() => {
      if (failSequenceRef.current !== failSequence) return;

      primeTypewriterAudio();
      setTypewriterAudioEnabled(true);
      setSolutionRevealReady(true);
    });
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
    setSolutionRevealReady(false);
    failSequenceRef.current += 1;
    onFailedChange?.(false);
    setSolutionComplete(false);
    setSecondsRemaining(challengeMinutesToSeconds(challengeMinutes));
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
    onFailedChange?.(false);
    setSelectedPath(null);
    setSessionKey((current) => current + 1);
    onShowResults();
  }

  return (
    <FieldSet
      className={cn("w-full", failed && "flex min-h-0 flex-1 flex-col gap-0")}
    >
      <div className={cn(failed && "min-h-0 flex-1 overflow-y-auto")}>
        <DashboardQuestionPrompt
          key={`${question.id}-${sessionKey}`}
          active={questionStarted}
          question={question}
          questionNumber={questionIndex + 1}
          totalQuestions={getTotalQuestionCount()}
          onComplete={() => setQuestionDisplayed(true)}
        />
        {failed && solutionRevealReady ? (
          <DashboardQuestionSolutionReveal
            key={`${question.id}-solution-${sessionKey}`}
            question={question}
            showNext={hasNextQuestion(questionIndex)}
            showFinalResult={isLastQuestion(questionIndex)}
            onNext={handleNext}
            onShowFinalResult={handleShowFinalResult}
          />
        ) : null}
      </div>
      {failed ? null : (
      <div className="flex w-full items-end gap-4">
        <div className="flex shrink-0 items-end gap-2">
          <DashboardChallengeMinutesControl
            value={challengeMinutes}
            onChange={setChallengeMinutes}
            disabled={challengeActive}
          />
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
      )}
    </FieldSet>
  );
}
