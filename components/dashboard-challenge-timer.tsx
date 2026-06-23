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
    <span
      className={cn(
        "min-w-[3ch] font-mono text-sm tabular-nums",
        expired ? "text-red-500" : "text-muted-foreground",
      )}
      aria-live="polite"
    >
      {formatChallengeTime(secondsRemaining)}
    </span>
  );
}
