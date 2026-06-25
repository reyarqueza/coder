"use client";

import { CoderBahamutoSprite } from "@/components/coder-bahamuto-sprite";
import { Button } from "@/components/ui/button";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import { cn } from "@/lib/utils";

type DashboardQuizResultsProps = {
  correctCount: number;
  total: number;
  onPlayAgain: () => void;
};

export function DashboardQuizResults({
  correctCount,
  total,
  onPlayAgain,
}: DashboardQuizResultsProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 p-6">
      <CoderBahamutoSprite pose="stand" facing="right" variant="default" />
      <p
        className={cn(
          pressStart2P.className,
          "text-center text-sm leading-relaxed text-foreground",
        )}
      >
        {correctCount} / {total} correct
      </p>
      <Button type="button" onClick={onPlayAgain}>
        Play Again
      </Button>
    </div>
  );
}
