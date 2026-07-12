"use client";

import { DashboardQuestionPrompt } from "@/components/dashboard-question-prompt";
import { DashboardTypewriterSections } from "@/components/dashboard-typewriter-sections";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import type { CodingQuestion } from "@/lib/questions/types";
import { cn } from "@/lib/utils";

type DashboardQuestionPracticeViewProps = {
  active: boolean;
  question: CodingQuestion;
  questionNumber: number;
  totalQuestions: number;
  showAnswer: boolean;
  onQuestionComplete?: () => void;
  onAnswerComplete?: () => void;
};

export function DashboardQuestionPracticeView({
  active,
  question,
  questionNumber,
  totalQuestions,
  showAnswer,
  onQuestionComplete,
  onAnswerComplete,
}: DashboardQuestionPracticeViewProps) {
  return (
    <div className="space-y-4">
      <DashboardQuestionPrompt
        active={active}
        question={question}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        onComplete={onQuestionComplete}
      />
      {showAnswer ? (
        <div className="space-y-2">
          <p
            className={cn(
              pressStart2P.className,
              "text-sm leading-relaxed text-green-600",
            )}
          >
            Answer:
          </p>
          <DashboardTypewriterSections
            sections={question.solution}
            active={showAnswer}
            sectionKey={`${question.id}-solution`}
            ariaLabel="Correct answer and explanation"
            onComplete={onAnswerComplete}
          />
        </div>
      ) : null}
    </div>
  );
}
