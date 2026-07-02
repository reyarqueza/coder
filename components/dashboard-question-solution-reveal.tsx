"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardTypewriterSections } from "@/components/dashboard-typewriter-sections";
import { cn } from "@/lib/utils";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import type { CodingQuestion } from "@/lib/questions/types";

type DashboardQuestionSolutionRevealProps = {
  question: CodingQuestion;
  showNext: boolean;
  showFinalResult: boolean;
  onNext: () => void;
  onShowFinalResult: () => void;
};

export function DashboardQuestionSolutionReveal({
  question,
  showNext,
  showFinalResult,
  onNext,
  onShowFinalResult,
}: DashboardQuestionSolutionRevealProps) {
  const [revealComplete, setRevealComplete] = useState(false);

  return (
    <div className="mt-4">
      <p
        className={cn(
          pressStart2P.className,
          "mb-2 text-sm leading-relaxed text-red-500",
        )}
      >
        Correct answer:
      </p>
      <DashboardTypewriterSections
        sections={question.solution}
        active
        sectionKey={`${question.id}-solution`}
        ariaLabel="Correct answer and explanation"
        onComplete={() => setRevealComplete(true)}
      />
      {revealComplete && showNext ? (
        <div className="mt-4">
          <Button type="button" onClick={onNext}>
            Next
          </Button>
        </div>
      ) : null}
      {revealComplete && showFinalResult ? (
        <div className="mt-4">
          <Button type="button" onClick={onShowFinalResult}>
            Final Result
          </Button>
        </div>
      ) : null}
    </div>
  );
}
