"use client";

import { CodeEditor } from "@/components/workspace/code-editor";
import { FileTree } from "@/components/workspace/file-tree";
import { PreviewPanel } from "@/components/workspace/preview-panel";
import { TerminalPanel } from "@/components/workspace/terminal";

export function WorkspacePanels() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-[3] border-b">
        <div className="w-56 shrink-0 overflow-y-auto border-r">
          <FileTree />
        </div>
        <div className="min-h-0 flex-1 border-r">
          <CodeEditor />
        </div>
        <div className="min-h-0 flex-1">
          <PreviewPanel />
        </div>
      </div>
      <div className="min-h-0 flex-[2]">
        <TerminalPanel />
      </div>
    </div>
  );
}
