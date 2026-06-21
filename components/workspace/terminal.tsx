"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";
import { WorkspacePanel } from "@/components/workspace/workspace-panel";
import { getTerminalTheme, workspaceUi } from "@/lib/workspace/colors";
import { cn } from "@/lib/utils";

export function TerminalPanel() {
  const { webcontainer, status } = useWebContainer();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.options.theme = getTerminalTheme(isDark);
    }
  }, [isDark]);

  useEffect(() => {
    if (!containerRef.current || !webcontainer || status !== "ready") return;

    const terminal = new Terminal({
      convertEol: true,
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      theme: getTerminalTheme(isDark),
    });
    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);
    fitAddon.fit();

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;

    const instance = webcontainer;
    let shellProcess: Awaited<ReturnType<typeof instance.spawn>> | null = null;
    let inputWriter: WritableStreamDefaultWriter<string> | null = null;
    let cancelled = false;

    async function startShell() {
      shellProcess = await instance.spawn("jsh", {
        terminal: {
          cols: terminal.cols,
          rows: terminal.rows,
        },
      });

      if (cancelled) {
        shellProcess.kill();
        return;
      }

      inputWriter = shellProcess.input.getWriter();

      void shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        }),
      );

      terminal.onData((data) => {
        void inputWriter?.write(data);
      });
    }

    void startShell();

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(containerRef.current);

    terminal.onResize(({ cols, rows }) => {
      void shellProcess?.resize({ cols, rows });
    });

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      void inputWriter?.close();
      shellProcess?.kill();
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, [webcontainer, status]);

  if (status !== "ready") {
    return (
      <div className="flex h-full min-h-0 items-center justify-center text-sm text-muted-foreground">
        Terminal will be available once the environment is ready.
      </div>
    );
  }

  return (
    <WorkspacePanel title="Terminal" bodyClassName={cn(workspaceUi.bg, "relative min-h-0")}>
      <div ref={containerRef} className="workspace-terminal-host" />
    </WorkspacePanel>
  );
}
