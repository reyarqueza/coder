"use client";

import { Suspense, useState } from "react";
import { DashboardGroupMenu } from "@/components/dashboard-group-menu";
import { DashboardIde } from "@/components/dashboard-ide";
import { DashboardQuizResults } from "@/components/dashboard-quiz-results";
import { DashboardToolbar } from "@/components/dashboard-toolbar";
import { getTotalQuestionCountForGroup } from "@/lib/questions/catalog";
import { getQuestionGroupById } from "@/lib/questions/groups";
import type { QuestionGroupId } from "@/lib/questions/types";
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

type DashboardPhase = "menu" | "quiz" | "results";

type DashboardPageClientProps = {
  initialChallengeMinutes: number;
};

function DashboardContent({ initialChallengeMinutes }: DashboardPageClientProps) {
  const [phase, setPhase] = useState<DashboardPhase>("menu");
  const [selectedGroupId, setSelectedGroupId] = useState<QuestionGroupId | null>(
    null,
  );
  const [quizKey, setQuizKey] = useState(0);
  const [started, setStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [challengeFailed, setChallengeFailed] = useState(false);

  const selectedGroup = selectedGroupId
    ? getQuestionGroupById(selectedGroupId)
    : null;

  function handleSelectGroup(groupId: QuestionGroupId) {
    setSelectedGroupId(groupId);
    setPhase("quiz");
    setQuizKey((current) => current + 1);
  }

  function resetQuizState() {
    resetTypewriterAudio();
    setCorrectCount(0);
    setStarted(false);
    setChallengeFailed(false);
  }

  function handlePlayAgain() {
    resetQuizState();
    setQuizKey((current) => current + 1);
    setPhase("quiz");
  }

  function handleChooseGroup() {
    resetQuizState();
    setSelectedGroupId(null);
    setPhase("menu");
  }

  return (
    <WorkspaceReadyProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {phase === "menu" ? (
          <DashboardGroupMenu onSelect={handleSelectGroup} />
        ) : phase === "results" && selectedGroupId && selectedGroup ? (
          <DashboardQuizResults
            groupLabel={selectedGroup.label}
            correctCount={correctCount}
            total={getTotalQuestionCountForGroup(selectedGroupId)}
            onPlayAgain={handlePlayAgain}
            onChooseGroup={handleChooseGroup}
          />
        ) : selectedGroupId ? (
          <>
            <div
              className={
                challengeFailed
                  ? "flex min-h-0 flex-1 flex-col overflow-hidden border-b p-4"
                  : "shrink-0 border-b p-4"
              }
            >
              <DashboardToolbar
                key={`${selectedGroupId}-${quizKey}`}
                groupId={selectedGroupId}
                initialChallengeMinutes={initialChallengeMinutes}
                started={started}
                onStartedChange={setStarted}
                onCorrect={() => setCorrectCount((current) => current + 1)}
                onShowResults={() => setPhase("results")}
                onFailedChange={setChallengeFailed}
              />
            </div>
            {started && !challengeFailed ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <DashboardIde />
              </div>
            ) : null}
          </>
        ) : null}
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
