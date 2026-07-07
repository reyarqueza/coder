"use client";

import { DashboardTypewriterSections } from "@/components/dashboard-typewriter-sections";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import type { CodingQuestion } from "@/lib/questions/types";
import { cn } from "@/lib/utils";

type DashboardQuestionPromptProps = {
  active: boolean;
  question: CodingQuestion;
  questionNumber: number;
  totalQuestions: number;
  onComplete?: () => void;
};

export function DashboardQuestionPrompt({
  active,
  question,
  questionNumber,
  totalQuestions,
  onComplete,
}: DashboardQuestionPromptProps) {
  return (
    <div className="space-y-2">
      {active ? (
        <p
          className={cn(
            pressStart2P.className,
            "text-sm leading-relaxed text-muted-foreground",
          )}
        >
          ({questionNumber}/{totalQuestions})
        </p>
      ) : null}
      <DashboardTypewriterSections
        sections={question.sections}
        active={active}
        sectionKey={question.id}
        onComplete={onComplete}
        ariaLabel="Question prompt"
      />
    </div>
  );
}
