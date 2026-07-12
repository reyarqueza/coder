"use client";

import { Suspense, useState } from "react";
import { DashboardGroupMenu } from "@/components/dashboard-group-menu";
import { DashboardIde } from "@/components/dashboard-ide";
import { DashboardModeMenu } from "@/components/dashboard-mode-menu";
import { DashboardPracticeToolbar } from "@/components/dashboard-practice-toolbar";
import { DashboardQuizResults } from "@/components/dashboard-quiz-results";
import { DashboardToolbar } from "@/components/dashboard-toolbar";
import { getTotalQuestionCountForGroup } from "@/lib/questions/catalog";
import { getQuestionGroupById } from "@/lib/questions/groups";
import type { QuestionGroupId } from "@/lib/questions/types";
import type { SessionMode } from "@/lib/session/mode";
import { resetTypewriterAudio } from "@/lib/beepbox/play-typewriter-blip";
import { WorkspaceReadyProvider } from "@/components/workspace/workspace-ready-provider";
import { cn } from "@/lib/utils";

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
type MenuStep = "mode" | "group";

type DashboardPageClientProps = {
  initialChallengeMinutes: number;
};

function DashboardContent({ initialChallengeMinutes }: DashboardPageClientProps) {
  const [phase, setPhase] = useState<DashboardPhase>("menu");
  const [menuStep, setMenuStep] = useState<MenuStep>("mode");
  const [sessionMode, setSessionMode] = useState<SessionMode | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<QuestionGroupId | null>(
    null,
  );
  const [quizKey, setQuizKey] = useState(0);
  const [started, setStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [challengeFailed, setChallengeFailed] = useState(false);
  const [setupActive, setSetupActive] = useState(false);

  const selectedGroup = selectedGroupId
    ? getQuestionGroupById(selectedGroupId)
    : null;
  const isPractice = sessionMode === "practice";
  const showIde = isPractice
    ? true
    : setupActive
      ? !challengeFailed
      : started && !challengeFailed;

  function handleSelectMode(mode: SessionMode) {
    setSessionMode(mode);
    setMenuStep("group");
  }

  function handleSelectGroup(groupId: QuestionGroupId) {
    setSelectedGroupId(groupId);
    setSetupActive(groupId === "react-hooks");
    setPhase("quiz");
    setQuizKey((current) => current + 1);
  }

  function resetQuizState() {
    resetTypewriterAudio();
    setCorrectCount(0);
    setStarted(false);
    setChallengeFailed(false);
    setSetupActive(false);
  }

  function handleBackToMenu() {
    resetQuizState();
    setSelectedGroupId(null);
    setSessionMode(null);
    setMenuStep("mode");
    setPhase("menu");
  }

  function handleBackToModeSelection() {
    setMenuStep("mode");
    setSessionMode(null);
  }

  function handlePlayAgain() {
    resetQuizState();
    setQuizKey((current) => current + 1);
    setPhase("quiz");
  }

  return (
    <WorkspaceReadyProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {phase === "menu" && menuStep === "mode" ? (
          <DashboardModeMenu onSelect={handleSelectMode} />
        ) : phase === "menu" && menuStep === "group" && sessionMode ? (
          <DashboardGroupMenu
            mode={sessionMode}
            onSelect={handleSelectGroup}
            onBack={handleBackToModeSelection}
          />
        ) : phase === "results" && selectedGroupId && selectedGroup ? (
          <DashboardQuizResults
            groupLabel={selectedGroup.label}
            correctCount={correctCount}
            total={getTotalQuestionCountForGroup(selectedGroupId)}
            onPlayAgain={handlePlayAgain}
            onChooseGroup={handleBackToMenu}
          />
        ) : selectedGroupId && sessionMode === "practice" ? (
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,45vh)_minmax(0,1fr)] overflow-hidden">
            <div className="flex min-h-0 flex-col overflow-hidden border-b p-4">
              <DashboardPracticeToolbar
                key={`${selectedGroupId}-${quizKey}`}
                groupId={selectedGroupId}
                onSetupActiveChange={setSetupActive}
                onBackToMenu={handleBackToMenu}
              />
            </div>
            {showIde ? (
              <div className="flex min-h-0 flex-col overflow-hidden">
                <DashboardIde terminalOnly={setupActive} />
              </div>
            ) : null}
          </div>
        ) : selectedGroupId ? (
          <div
            className={cn(
              "grid min-h-0 flex-1 overflow-hidden",
              challengeFailed
                ? "grid-rows-[minmax(0,1fr)]"
                : "grid-rows-[minmax(0,45vh)_minmax(0,1fr)]",
            )}
          >
            <div className="flex min-h-0 flex-col overflow-hidden border-b p-4">
              <DashboardToolbar
                key={`${selectedGroupId}-${quizKey}`}
                groupId={selectedGroupId}
                initialChallengeMinutes={initialChallengeMinutes}
                started={started}
                onStartedChange={setStarted}
                onCorrect={() => setCorrectCount((current) => current + 1)}
                onShowResults={() => setPhase("results")}
                onFailedChange={setChallengeFailed}
                onSetupActiveChange={setSetupActive}
              />
            </div>
            {showIde ? (
              <div className="flex min-h-0 flex-col overflow-hidden">
                <DashboardIde terminalOnly={setupActive} />
              </div>
            ) : null}
          </div>
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
