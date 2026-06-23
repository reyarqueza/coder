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
import { primeTypewriterAudio } from "@/lib/beepbox/play-typewriter-blip";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";
import { useWorkspaceReady } from "@/components/workspace/workspace-ready-provider";

export function DashboardToolbar() {
  const { workspaceReady } = useWorkspaceReady();
  const { webcontainer, status, setSelectedPath, refreshFiles } =
    useWebContainer();
  const [questionStarted, setQuestionStarted] = useState(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [solutionComplete, setSolutionComplete] = useState(false);
  const [failed, setFailed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    CHALLENGE_DURATION_SECONDS,
  );
  const question = getDefaultQuestion();

  useEffect(() => {
    if (!started || solutionComplete || failed) return;

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          setFailed(true);
          setPlaying(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [started, solutionComplete, failed]);

  async function handleStartQuestion() {
    primeTypewriterAudio();
    setQuestionStarted(true);
  }

  async function handleBegin() {
    if (!webcontainer || status !== "ready") return;

    const starterPath = await seedQuestionStarterFile(webcontainer, question);
    if (starterPath) {
      refreshFiles();
      setSelectedPath(starterPath);
    }
  }

  function handleCorrect() {
    setSolutionComplete(true);
    setPlaying(false);
  }

  return (
    <FieldSet className="w-full">
      <DashboardQuestionPrompt active={questionStarted} question={question} />
      <div className="flex w-full items-end gap-4">
        <div className="flex shrink-0 items-end gap-2">
          <Button
            type="button"
            disabled={!workspaceReady || questionStarted}
            onClick={() => void handleStartQuestion()}
          >
            Start
          </Button>
          <DashboardCheckAnswer
            question={question}
            enabled={workspaceReady && questionStarted}
            disabled={failed || solutionComplete}
            onCorrect={handleCorrect}
          />
          <DashboardMusicPlayer
            started={started}
            playing={playing}
            onStartedChange={setStarted}
            onPlayingChange={setPlaying}
            onBegin={handleBegin}
          />
          <DashboardChallengeTimer
            active={started}
            expired={failed}
            secondsRemaining={secondsRemaining}
          />
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
