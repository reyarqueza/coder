"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CodingQuestion } from "@/lib/questions/types";
import type { ValidateAnswerResult } from "@/lib/questions/validate-answer";
import { validateAnswer } from "@/lib/questions/validate-answer";
import { runNodeFile } from "@/lib/webcontainer/run-node-file";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";

type DashboardCheckAnswerProps = {
  question: CodingQuestion;
  enabled: boolean;
  onCorrect?: () => void;
  disabled?: boolean;
};

export function DashboardCheckAnswer({
  question,
  enabled,
  onCorrect,
  disabled = false,
}: DashboardCheckAnswerProps) {
  const { webcontainer, status } = useWebContainer();
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<ValidateAnswerResult | null>(null);

  async function handleCheck() {
    if (!webcontainer || status !== "ready" || checking) return;

    setChecking(true);
    setResult(null);

    const { entryFile } = question.validation;

    try {
      await webcontainer.fs.readFile(entryFile, "utf-8");
    } catch {
      setResult({
        ok: false,
        message: `Create ${entryFile} first.`,
      });
      setChecking(false);
      return;
    }

    try {
      const runResult = await runNodeFile(webcontainer, entryFile);
      const validation = validateAnswer(question, runResult);
      setResult(validation);
      if (validation.ok) {
        onCorrect?.();
      }
    } catch (error) {
      setResult({
        ok: false,
        message:
          error instanceof Error ? error.message : "Failed to run your solution.",
      });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        type="button"
        variant="outline"
        disabled={!enabled || checking || disabled || status !== "ready"}
        onClick={() => void handleCheck()}
      >
        {checking ? "Checking…" : "Check Answer"}
      </Button>
      {result ? (
        <p
          className={cn(
            "text-sm",
            result.ok ? "text-green-600 dark:text-green-400" : "text-destructive",
          )}
          role="status"
        >
          {result.ok ? "Correct!" : result.message}
        </p>
      ) : null}
    </div>
  );
}
