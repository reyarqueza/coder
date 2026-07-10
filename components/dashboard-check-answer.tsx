"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CodingQuestion } from "@/lib/questions/types";
import { isReactPreviewValidation } from "@/lib/questions/types";
import { primeOutcomeAudio } from "@/lib/beepbox/play-outcome-sound";
import {
  validateAnswer,
  validateReactPreview,
} from "@/lib/questions/validate-answer";
import { runNodeFile } from "@/lib/webcontainer/run-node-file";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";

type DashboardCheckAnswerProps = {
  question: CodingQuestion;
  enabled: boolean;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  disabled?: boolean;
};

function getEntryPath(question: CodingQuestion): string {
  const { validation } = question;
  if (isReactPreviewValidation(validation)) {
    return `${validation.appDir}/src/App.jsx`;
  }
  return validation.entryFile;
}

export function DashboardCheckAnswer({
  question,
  enabled,
  onCorrect,
  onIncorrect,
  disabled = false,
}: DashboardCheckAnswerProps) {
  const { webcontainer, status } = useWebContainer();
  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    if (!webcontainer || status !== "ready" || checking) return;

    primeOutcomeAudio();
    setChecking(true);

    const entryPath = getEntryPath(question);

    try {
      await webcontainer.fs.readFile(entryPath, "utf-8");
    } catch {
      setChecking(false);
      return;
    }

    try {
      const { validation } = question;

      if (isReactPreviewValidation(validation)) {
        const result = await validateReactPreview(webcontainer, validation);
        if (result.ok) {
          onCorrect?.();
        } else {
          onIncorrect?.();
        }
      } else {
        const runResult = await runNodeFile(webcontainer, validation.entryFile);
        const result = validateAnswer(question, runResult);
        if (result.ok) {
          onCorrect?.();
        } else {
          onIncorrect?.();
        }
      }
    } catch {
    } finally {
      setChecking(false);
    }
  }

  return (
    <Button
      type="button"
      disabled={!enabled || checking || disabled || status !== "ready"}
      onClick={() => void handleCheck()}
      className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
    >
      {checking ? "Checking…" : "Check Answer"}
    </Button>
  );
}
