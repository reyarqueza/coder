"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CoderBahamutoSprite } from "@/components/coder-bahamuto-sprite";
import {
  playTypewriterBlip,
  primeTypewriterAudio,
} from "@/lib/beepbox/play-typewriter-blip";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import { getAllQuestionGroups } from "@/lib/questions/groups";
import type { QuestionGroupId } from "@/lib/questions/types";
import { cn } from "@/lib/utils";

type DashboardGroupMenuProps = {
  onSelect: (groupId: QuestionGroupId) => void;
};

export function DashboardGroupMenu({ onSelect }: DashboardGroupMenuProps) {
  const groups = getAllQuestionGroups();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const moveSelection = useCallback(
    (delta: number) => {
      setSelectedIndex((current) => {
        const next = Math.max(0, Math.min(groups.length - 1, current + delta));
        if (next !== current) {
          primeTypewriterAudio();
          playTypewriterBlip();
        }
        return next;
      });
    },
    [groups.length],
  );

  useEffect(() => {
    listRef.current?.focus();
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(groups[selectedIndex].id);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 p-6">
      <CoderBahamutoSprite pose="stand" facing="right" variant="default" />
      <p
        className={cn(
          pressStart2P.className,
          "text-center text-sm leading-relaxed text-foreground",
        )}
      >
        Choose a challenge
      </p>
      <ul
        ref={listRef}
        role="listbox"
        aria-label="Question groups"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex w-full max-w-md flex-col gap-2 outline-none"
      >
        {groups.map((group, index) => {
          const isSelected = index === selectedIndex;
          const count = group.questionIds.length;

          return (
            <li
              key={group.id}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(group.id)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "cursor-pointer rounded-lg border px-4 py-3 transition-colors",
                isSelected
                  ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                  : "border-border bg-background hover:bg-muted/50",
              )}
            >
              <p
                className={cn(
                  pressStart2P.className,
                  "text-xs leading-relaxed",
                  isSelected ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {group.label} ({count})
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {group.description}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
