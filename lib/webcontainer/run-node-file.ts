import type { WebContainer } from "@webcontainer/api";
import { getWorkspacePathEnv } from "@/lib/webcontainer/setup-workspace";

const RUN_TIMEOUT_MS = 5000;

export type NodeRunResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

async function readStream(stream: ReadableStream<string>): Promise<string> {
  const reader = stream.getReader();
  let output = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      output += value;
    }
  } finally {
    reader.releaseLock();
  }

  return output;
}

export async function runNodeFile(
  webcontainer: WebContainer,
  filePath: string,
): Promise<NodeRunResult> {
  const process = await webcontainer.spawn("node", [filePath], {
    env: {
      ...getWorkspacePathEnv(),
      NO_COLOR: "1",
      FORCE_COLOR: "0",
    },
  });

  let timedOut = false;
  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    process.kill();
  }, RUN_TIMEOUT_MS);

  try {
    const [output, exitCode] = await Promise.all([
      readStream(process.output),
      process.exit,
    ]);

    if (timedOut) {
      return {
        stdout: "",
        stderr: `Timed out after ${RUN_TIMEOUT_MS / 1000} seconds.`,
        exitCode: 1,
      };
    }

    const trimmed = output.trimEnd();
    if (exitCode === 0) {
      return { stdout: trimmed, stderr: "", exitCode };
    }

    return {
      stdout: "",
      stderr: trimmed || `Process exited with code ${exitCode}.`,
      exitCode,
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
