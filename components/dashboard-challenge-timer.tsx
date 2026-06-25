"use client";

import { cn } from "@/lib/utils";

const CHALLENGE_DURATION_SECONDS = 60;

export function formatChallengeTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export { CHALLENGE_DURATION_SECONDS };

type DashboardChallengeTimerProps = {
  secondsRemaining: number;
  active: boolean;
  expired: boolean;
};

export function DashboardChallengeTimer({
  secondsRemaining,
  active,
  expired,
}: DashboardChallengeTimerProps) {
  if (!active && !expired) return null;

  return (
    <div
      aria-live="polite"
      className={cn(
        "inline-flex h-8 min-w-[4.25rem] shrink-0 items-center justify-center overflow-hidden rounded-lg border box-border px-2",
        "bg-background",
        expired ? "border-red-500/50" : "border-border",
      )}
    >
      <span
        className={cn(
          "font-mono text-[length:calc(2rem-10px)] font-semibold leading-none tabular-nums",
          expired ? "text-red-500" : "text-foreground",
        )}
      >
        {formatChallengeTime(secondsRemaining)}
      </span>
    </div>
  );
}
