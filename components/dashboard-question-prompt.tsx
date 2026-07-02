"use client";

import { DashboardTypewriterSections } from "@/components/dashboard-typewriter-sections";
import type { CodingQuestion } from "@/lib/questions/types";

type DashboardQuestionPromptProps = {
  active: boolean;
  question: CodingQuestion;
  onComplete?: () => void;
};

export function DashboardQuestionPrompt({
  active,
  question,
  onComplete,
}: DashboardQuestionPromptProps) {
  return (
    <DashboardTypewriterSections
      sections={question.sections}
      active={active}
      sectionKey={question.id}
      onComplete={onComplete}
      ariaLabel="Question prompt"
    />
  );
}
