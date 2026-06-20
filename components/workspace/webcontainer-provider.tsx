"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WebContainer } from "@webcontainer/api";
import { getWebContainer } from "@/lib/webcontainer/boot-webcontainer";

type BootStatus = "booting" | "installing" | "ready" | "error";

type WebContainerContextValue = {
  webcontainer: WebContainer | null;
  status: BootStatus;
  error: string | null;
  selectedPath: string | null;
  setSelectedPath: (path: string | null) => void;
  refreshKey: number;
  refreshFiles: () => void;
};

const WebContainerContext = createContext<WebContainerContextValue | null>(null);

export function useWebContainer() {
  const context = useContext(WebContainerContext);
  if (!context) {
    throw new Error("useWebContainer must be used within WebContainerProvider.");
  }
  return context;
}

export function WebContainerProvider({ children }: { children: ReactNode }) {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [status, setStatus] = useState<BootStatus>("booting");
  const [error, setError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshFiles = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const instance = await getWebContainer();
        if (cancelled) return;

        setWebcontainer(instance);
        setStatus("installing");

        const installProcess = await instance.spawn("npm", ["install"]);
        const exitCode = await installProcess.exit;

        if (cancelled) return;

        if (exitCode !== 0) {
          setStatus("error");
          setError("Failed to install project dependencies.");
          return;
        }

        void instance.spawn("npm", ["run", "dev"]);

        setStatus("ready");
        setSelectedPath("main.js");
      } catch (bootError) {
        if (cancelled) return;
        setStatus("error");
        setError(
          bootError instanceof Error
            ? bootError.message
            : "Failed to boot WebContainer.",
        );
      }
    }

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      webcontainer,
      status,
      error,
      selectedPath,
      setSelectedPath,
      refreshKey,
      refreshFiles,
    }),
    [webcontainer, status, error, selectedPath, refreshKey, refreshFiles],
  );

  return (
    <WebContainerContext.Provider value={value}>
      {children}
    </WebContainerContext.Provider>
  );
}
