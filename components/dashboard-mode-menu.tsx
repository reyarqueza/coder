"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CoderBahamutoSprite } from "@/components/coder-bahamuto-sprite";
import {
  playTypewriterBlip,
  primeTypewriterAudio,
} from "@/lib/beepbox/play-typewriter-blip";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import type { SessionMode } from "@/lib/session/mode";
import { cn } from "@/lib/utils";

const MODES: { id: SessionMode; label: string; description: string }[] = [
  {
    id: "practice",
    label: "Practice Mode",
    description: "Read questions and answers, practice at your own pace",
  },
  {
    id: "challenge",
    label: "Challenge Mode",
    description: "Timed test — answer before the clock runs out",
  },
];

type DashboardModeMenuProps = {
  onSelect: (mode: SessionMode) => void;
};

export function DashboardModeMenu({ onSelect }: DashboardModeMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const moveSelection = useCallback((delta: number) => {
    setSelectedIndex((current) => {
      const next = Math.max(0, Math.min(MODES.length - 1, current + delta));
      if (next !== current) {
        primeTypewriterAudio();
        playTypewriterBlip();
      }
      return next;
    });
  }, []);

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
      onSelect(MODES[selectedIndex].id);
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
        Choose a mode
      </p>
      <ul
        ref={listRef}
        role="listbox"
        aria-label="Session modes"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex w-full max-w-md flex-col gap-2 outline-none"
      >
        {MODES.map((mode, index) => {
          const isSelected = index === selectedIndex;

          return (
            <li
              key={mode.id}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(mode.id)}
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
                {mode.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode.description}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
