"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";

export function TerminalPanel() {
  const { webcontainer, status } = useWebContainer();
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current || !webcontainer || status !== "ready") return;

    const terminal = new Terminal({
      convertEol: true,
      fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
      fontSize: 13,
      theme: {
        background: "transparent",
      },
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
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Terminal will be available once the environment is ready.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b px-3 py-2 text-xs text-muted-foreground">
        Terminal
      </div>
      <div ref={containerRef} className="min-h-0 flex-1 p-2" />
    </div>
  );
}
