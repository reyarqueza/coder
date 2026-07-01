"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { updateChallengeMinutes } from "@/app/actions/challenge-settings";
import {
  playTypewriterBlip,
  primeTypewriterAudio,
} from "@/lib/beepbox/play-typewriter-blip";
import {
  clampChallengeMinutes,
  MAX_CHALLENGE_MINUTES,
  MIN_CHALLENGE_MINUTES,
} from "@/lib/challenge/constants";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DashboardChallengeMinutesControlProps = {
  value: number;
  onChange: (minutes: number) => void;
  disabled?: boolean;
};

export function DashboardChallengeMinutesControl({
  value,
  onChange,
  disabled = false,
}: DashboardChallengeMinutesControlProps) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  function scheduleSave(minutes: number) {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void updateChallengeMinutes(minutes).catch((error) => {
        console.error("Failed to save challenge minutes:", error);
      });
    }, 300);
  }

  function stepValue(delta: number) {
    const next = clampChallengeMinutes(value + delta);
    if (next === value) return;

    primeTypewriterAudio();
    playTypewriterBlip();
    onChange(next);
    scheduleSave(next);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const parsed = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(parsed)) return;

    const clamped = clampChallengeMinutes(parsed);
    onChange(clamped);
    scheduleSave(clamped);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      stepValue(1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      stepValue(-1);
    }
  }

  return (
    <Field orientation="horizontal" className="w-auto shrink-0 items-center gap-1.5">
      <Label htmlFor="challenge-minutes" className="text-xs text-muted-foreground">
        Minutes
      </Label>
      <div className="flex items-stretch">
        <Input
          id="challenge-minutes"
          type="number"
          min={MIN_CHALLENGE_MINUTES}
          max={MAX_CHALLENGE_MINUTES}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="h-8 w-14 rounded-r-none border-r-0 px-2 tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label="Challenge timer minutes"
        />
        <div className="flex flex-col">
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            disabled={disabled || value >= MAX_CHALLENGE_MINUTES}
            onClick={() => stepValue(1)}
            className="h-4 w-6 min-h-0 rounded-none rounded-tr-lg border-l-0 px-0"
            aria-label="Increase minutes"
          >
            <ChevronUp />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            disabled={disabled || value <= MIN_CHALLENGE_MINUTES}
            onClick={() => stepValue(-1)}
            className="h-4 w-6 min-h-0 rounded-none rounded-br-lg border-l-0 border-t-0 px-0"
            aria-label="Decrease minutes"
          >
            <ChevronDown />
          </Button>
        </div>
      </div>
    </Field>
  );
}
