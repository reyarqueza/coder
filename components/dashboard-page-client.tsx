"use client";

import { Suspense, useState } from "react";
import { DashboardIde } from "@/components/dashboard-ide";
import { DashboardQuizResults } from "@/components/dashboard-quiz-results";
import { DashboardToolbar } from "@/components/dashboard-toolbar";
import { getTotalQuestionCount } from "@/lib/questions/catalog";
import { resetTypewriterAudio } from "@/lib/beepbox/play-typewriter-blip";
import { WorkspaceReadyProvider } from "@/components/workspace/workspace-ready-provider";

function DashboardFallback() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b p-4">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

type DashboardPageClientProps = {
  initialChallengeMinutes: number;
};

function DashboardContent({ initialChallengeMinutes }: DashboardPageClientProps) {
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  function handlePlayAgain() {
    resetTypewriterAudio();
    setShowResults(false);
    setCorrectCount(0);
    setStarted(false);
  }

  return (
    <WorkspaceReadyProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {showResults ? (
          <DashboardQuizResults
            correctCount={correctCount}
            total={getTotalQuestionCount()}
            onPlayAgain={handlePlayAgain}
          />
        ) : (
          <>
            <div className="shrink-0 border-b p-4">
              <DashboardToolbar
                initialChallengeMinutes={initialChallengeMinutes}
                started={started}
                onStartedChange={setStarted}
                onCorrect={() => setCorrectCount((current) => current + 1)}
                onShowResults={() => setShowResults(true)}
              />
            </div>
            {started ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <DashboardIde />
              </div>
            ) : null}
          </>
        )}
      </div>
    </WorkspaceReadyProvider>
  );
}

export function DashboardPageClient({
  initialChallengeMinutes,
}: DashboardPageClientProps) {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent initialChallengeMinutes={initialChallengeMinutes} />
    </Suspense>
  );
}
