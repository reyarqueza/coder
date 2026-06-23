"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WorkspacePanelId =
  | "fileTree"
  | "codeEditor"
  | "preview"
  | "terminal";

const WORKSPACE_PANEL_IDS: WorkspacePanelId[] = [
  "fileTree",
  "codeEditor",
  "preview",
  "terminal",
];

type WorkspaceReadyContextValue = {
  workspaceReady: boolean;
  reportPanelReady: (panel: WorkspacePanelId) => void;
  resetPanelReady: (panel: WorkspacePanelId) => void;
};

const WorkspaceReadyContext = createContext<WorkspaceReadyContextValue | null>(
  null,
);

export function useWorkspaceReady() {
  const context = useContext(WorkspaceReadyContext);
  if (!context) {
    throw new Error(
      "useWorkspaceReady must be used within WorkspaceReadyProvider.",
    );
  }
  return context;
}

export function WorkspaceReadyProvider({ children }: { children: ReactNode }) {
  const [readyPanels, setReadyPanels] = useState<
    Record<WorkspacePanelId, boolean>
  >({
    fileTree: false,
    codeEditor: false,
    preview: false,
    terminal: false,
  });

  const reportPanelReady = useCallback((panel: WorkspacePanelId) => {
    setReadyPanels((current) => {
      if (current[panel]) return current;
      return { ...current, [panel]: true };
    });
  }, []);

  const resetPanelReady = useCallback((panel: WorkspacePanelId) => {
    setReadyPanels((current) => {
      if (!current[panel]) return current;
      return { ...current, [panel]: false };
    });
  }, []);

  const workspaceReady = useMemo(
    () => WORKSPACE_PANEL_IDS.every((panel) => readyPanels[panel]),
    [readyPanels],
  );

  const value = useMemo(
    () => ({
      workspaceReady,
      reportPanelReady,
      resetPanelReady,
    }),
    [workspaceReady, reportPanelReady, resetPanelReady],
  );

  return (
    <WorkspaceReadyContext.Provider value={value}>
      {children}
    </WorkspaceReadyContext.Provider>
  );
}
