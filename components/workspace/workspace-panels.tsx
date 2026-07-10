"use client";

import { CodeEditor } from "@/components/workspace/code-editor";
import { FileTree } from "@/components/workspace/file-tree";
import { PreviewPanel } from "@/components/workspace/preview-panel";
import { TerminalPanel } from "@/components/workspace/terminal";

type WorkspacePanelsProps = {
  terminalOnly?: boolean;
};

export function WorkspacePanels({ terminalOnly = false }: WorkspacePanelsProps) {
  if (terminalOnly) {
    return (
      <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden p-2">
        <div className="min-h-0 flex-1 overflow-hidden">
          <TerminalPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 min-w-0 grid-rows-[minmax(0,3fr)_minmax(0,2fr)] gap-2 overflow-hidden p-2">
      <div className="grid min-h-0 min-w-0 grid-cols-[14rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 overflow-hidden">
        <div className="min-h-0 overflow-hidden">
          <FileTree />
        </div>
        <div className="min-h-0 overflow-hidden">
          <CodeEditor />
        </div>
        <div className="min-h-0 overflow-hidden">
          <PreviewPanel />
        </div>
      </div>
      <div className="min-h-0 overflow-hidden">
        <TerminalPanel />
      </div>
    </div>
  );
}
