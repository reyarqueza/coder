"use client";

import { CoderBahamutoSprite } from "@/components/coder-bahamuto-sprite";
import { Button } from "@/components/ui/button";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import { cn } from "@/lib/utils";

type DashboardQuizResultsProps = {
  groupLabel?: string;
  correctCount: number;
  total: number;
  onPlayAgain: () => void;
  onChooseGroup: () => void;
};

export function DashboardQuizResults({
  groupLabel,
  correctCount,
  total,
  onPlayAgain,
  onChooseGroup,
}: DashboardQuizResultsProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 p-6">
      <CoderBahamutoSprite pose="stand" facing="right" variant="default" />
      {groupLabel ? (
        <p
          className={cn(
            pressStart2P.className,
            "text-center text-xs leading-relaxed text-muted-foreground",
          )}
        >
          {groupLabel}
        </p>
      ) : null}
      <p
        className={cn(
          pressStart2P.className,
          "text-center text-sm leading-relaxed text-foreground",
        )}
      >
        {correctCount} / {total} correct
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button type="button" variant="outline" onClick={onChooseGroup}>
          Choose Group
        </Button>
      </div>
    </div>
  );
}
