"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getQuestionDisplayText } from "@/lib/questions/catalog";
import type { CodingQuestion } from "@/lib/questions/types";
import {
  playTypewriterBlip,
  shouldPlayTypewriterBlip,
} from "@/lib/beepbox/play-typewriter-blip";

const CHAR_DELAY_MS = 38;

type DashboardQuestionPromptProps = {
  active: boolean;
  question: CodingQuestion;
  onComplete?: () => void;
};

function renderVisibleSections(question: CodingQuestion, visibleLength: number) {
  let remaining = visibleLength;

  return question.sections.map((section, index) => {
    if (remaining <= 0) return null;

    const take = Math.min(remaining, section.content.length);
    remaining -= take;
    const text = section.content.slice(0, take);

    if (section.type === "code") {
      return (
        <pre
          key={`${question.id}-section-${index}`}
          className="mt-2 font-mono text-sm whitespace-pre-wrap"
        >
          {text}
        </pre>
      );
    }

    return (
      <p key={`${question.id}-section-${index}`} className="text-sm leading-relaxed">
        {text}
      </p>
    );
  });
}

export function DashboardQuestionPrompt({
  active,
  question,
  onComplete,
}: DashboardQuestionPromptProps) {
  const [visibleLength, setVisibleLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const hasStartedRef = useRef(false);
  const fullText = getQuestionDisplayText(question);

  useEffect(() => {
    if (!active || hasStartedRef.current) return;

    hasStartedRef.current = true;
    setVisibleLength(0);
    setIsTyping(true);

    let index = 0;

    const intervalId = window.setInterval(() => {
      index += 1;
      const nextLength = Math.min(index, fullText.length);
      const character = fullText[index - 1];

      if (character && shouldPlayTypewriterBlip(character)) {
        playTypewriterBlip();
      }

      setVisibleLength(nextLength);

      if (nextLength >= fullText.length) {
        window.clearInterval(intervalId);
        setIsTyping(false);
        onComplete?.();
      }
    }, CHAR_DELAY_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [active, fullText]);

  return (
    <div
      aria-live="polite"
      className={cn(
        "min-h-[1.25rem] text-sm font-medium",
        !active && "min-h-[1.25rem]",
      )}
    >
      {active ? (
        <>
          {renderVisibleSections(question, visibleLength)}
          {isTyping ? (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-[1em] w-2 animate-pulse bg-current align-[-0.1em]"
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
