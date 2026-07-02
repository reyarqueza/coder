"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardQuestionCodeBlock } from "@/components/dashboard-question-code-block";
import { cn } from "@/lib/utils";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import { getSectionsDisplayText } from "@/lib/questions/catalog";
import type { QuestionSection } from "@/lib/questions/types";
import {
  playTypewriterBlip,
  shouldPlayTypewriterBlip,
} from "@/lib/beepbox/play-typewriter-blip";

const CHAR_DELAY_MS = 38;

type DashboardTypewriterSectionsProps = {
  sections: QuestionSection[];
  active: boolean;
  sectionKey: string;
  onComplete?: () => void;
  className?: string;
  ariaLabel?: string;
};

function renderVisibleSections(
  sections: QuestionSection[],
  sectionKey: string,
  visibleLength: number,
) {
  let remaining = visibleLength;

  return sections.map((section, index) => {
    if (remaining <= 0) return null;

    const take = Math.min(remaining, section.content.length);
    remaining -= take;
    const text = section.content.slice(0, take);

    if (section.type === "code") {
      return (
        <DashboardQuestionCodeBlock
          key={`${sectionKey}-section-${index}`}
          content={text}
        />
      );
    }

    return (
      <p
        key={`${sectionKey}-section-${index}`}
        className={cn(pressStart2P.className, "text-sm leading-relaxed")}
      >
        {text}
      </p>
    );
  });
}

export function DashboardTypewriterSections({
  sections,
  active,
  sectionKey,
  onComplete,
  className,
  ariaLabel,
}: DashboardTypewriterSectionsProps) {
  const [visibleLength, setVisibleLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const fullText = getSectionsDisplayText(sections);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setVisibleLength(0);
      setIsTyping(false);
      return;
    }

    let index = 0;
    setVisibleLength(0);
    setIsTyping(true);

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
        onCompleteRef.current?.();
      }
    }, CHAR_DELAY_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [active, sectionKey, fullText]);

  return (
    <div
      aria-live="polite"
      aria-label={ariaLabel}
      className={cn("min-h-[1.25rem] text-sm font-medium", className)}
    >
      {active ? (
        <>
          {renderVisibleSections(sections, sectionKey, visibleLength)}
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
