"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardCheckAnswer } from "@/components/dashboard-check-answer";
import { DashboardGroupSetup } from "@/components/dashboard-group-setup";
import { DashboardQuestionPracticeView } from "@/components/dashboard-question-practice-view";
import { FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import {
  getQuestionAtIndexForGroup,
  getTotalQuestionCountForGroup,
} from "@/lib/questions/catalog";
import type { QuestionGroupId } from "@/lib/questions/types";
import { seedQuestionStarterFile } from "@/lib/questions/starter-files";
import {
  primeTypewriterAudio,
  setTypewriterAudioEnabled,
} from "@/lib/beepbox/play-typewriter-blip";
import { primeSuccessAudio } from "@/lib/beepbox/play-outcome-sound";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";
import { useWorkspaceReady } from "@/components/workspace/workspace-ready-provider";
import { cn } from "@/lib/utils";

type PracticeFeedback = "correct" | "incorrect" | null;

type DashboardPracticeToolbarProps = {
  groupId: QuestionGroupId;
  onSetupActiveChange?: (active: boolean) => void;
  onBackToMenu: () => void;
};

export function DashboardPracticeToolbar({
  groupId,
  onSetupActiveChange,
  onBackToMenu,
}: DashboardPracticeToolbarProps) {
  const { workspaceReady } = useWorkspaceReady();
  const { webcontainer, status, setSelectedPath, refreshFiles } =
    useWebContainer();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [questionStarted, setQuestionStarted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerComplete, setAnswerComplete] = useState(false);
  const [feedback, setFeedback] = useState<PracticeFeedback>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const question = getQuestionAtIndexForGroup(groupId, questionIndex);
  const totalQuestions = getTotalQuestionCountForGroup(groupId);
  const isReactHooksGroup = groupId === "react-hooks";
  const showSetup = isReactHooksGroup && !practiceStarted;
  const showStartButton = questionIndex === 0 && !questionStarted;

  useEffect(() => {
    onSetupActiveChange?.(showSetup);
  }, [showSetup, onSetupActiveChange]);

  useEffect(() => {
    if (isReactHooksGroup && showSetup) {
      primeTypewriterAudio();
      setTypewriterAudioEnabled(true);
    }
  }, [isReactHooksGroup, showSetup]);

  useEffect(() => {
    if (showSetup || !answerComplete || !webcontainer || status !== "ready") {
      return;
    }

    let cancelled = false;

    async function seedStarter() {
      primeSuccessAudio();
      const starterPath = await seedQuestionStarterFile(webcontainer!, question, {
        force: true,
      });
      if (cancelled || !starterPath) return;

      refreshFiles();
      setSelectedPath(starterPath);
    }

    void seedStarter();

    return () => {
      cancelled = true;
    };
  }, [
    showSetup,
    answerComplete,
    webcontainer,
    status,
    question.id,
    sessionKey,
    question,
    refreshFiles,
    setSelectedPath,
  ]);

  function handleStartQuestion() {
    primeTypewriterAudio();
    primeSuccessAudio();
    setPracticeStarted(true);
    setQuestionStarted(true);
  }

  function handleQuestionComplete() {
    setShowAnswer(true);
  }

  function handleAnswerComplete() {
    setAnswerComplete(true);
  }

  function handlePrev() {
    if (questionIndex <= 0) return;
    navigateToQuestion(questionIndex - 1);
  }

  function handleNext() {
    if (questionIndex >= totalQuestions - 1) return;
    navigateToQuestion(questionIndex + 1);
  }

  function navigateToQuestion(nextIndex: number) {
    setQuestionIndex(nextIndex);
    setFeedback(null);
    setShowAnswer(false);
    setAnswerComplete(false);
    setSelectedPath(null);
    setSessionKey((current) => current + 1);
    scrollRef.current?.scrollTo({ top: 0 });

    if (nextIndex > 0) {
      primeTypewriterAudio();
      primeSuccessAudio();
      setQuestionStarted(true);
    } else {
      setQuestionStarted(false);
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [question.id, sessionKey]);

  return (
    <FieldSet className="flex min-h-0 flex-1 flex-col gap-2">
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {showSetup ? (
          <DashboardGroupSetup active={showSetup} />
        ) : (
          <DashboardQuestionPracticeView
            key={`${question.id}-${sessionKey}`}
            active={questionStarted}
            question={question}
            questionNumber={questionIndex + 1}
            totalQuestions={totalQuestions}
            showAnswer={showAnswer}
            onQuestionComplete={handleQuestionComplete}
            onAnswerComplete={handleAnswerComplete}
          />
        )}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 pt-2">
        {!showSetup && showStartButton ? (
          <Button
            type="button"
            disabled={status !== "ready"}
            onClick={handleStartQuestion}
          >
            Start
          </Button>
        ) : null}
        {showSetup ? (
          <Button
            type="button"
            disabled={status !== "ready"}
            onClick={handleStartQuestion}
          >
            Start
          </Button>
        ) : null}
        {!showSetup && questionStarted ? (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={questionIndex <= 0}
              onClick={handlePrev}
            >
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={questionIndex >= totalQuestions - 1}
              onClick={handleNext}
            >
              Next
            </Button>
            {answerComplete ? (
              <DashboardCheckAnswer
                question={question}
                enabled={workspaceReady}
                onCorrect={() => setFeedback("correct")}
                onIncorrect={() => setFeedback("incorrect")}
              />
            ) : null}
            {feedback === "correct" ? (
              <span
                className={cn(
                  pressStart2P.className,
                  "text-xs leading-relaxed text-green-500",
                )}
              >
                Correct!
              </span>
            ) : null}
            {feedback === "incorrect" ? (
              <span
                className={cn(
                  pressStart2P.className,
                  "text-xs leading-relaxed text-red-500",
                )}
              >
                Not quite — see the answer above.
              </span>
            ) : null}
          </>
        ) : null}
        <Button type="button" variant="outline" onClick={onBackToMenu}>
          Back to Menu
        </Button>
      </div>
    </FieldSet>
  );
}
