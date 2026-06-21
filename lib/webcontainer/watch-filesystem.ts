import type { WebContainer } from "@webcontainer/api";

type WatchWorkspaceFilesystemOptions = {
  onStructureChange: () => void;
  onPathRemoved: (path: string) => void;
  debounceMs?: number;
};

function normalizeWatchPath(filename: string | Buffer | Uint8Array): string {
  const path =
    typeof filename === "string"
      ? filename
      : filename instanceof Buffer
        ? filename.toString("utf-8")
        : new TextDecoder().decode(filename);
  return path.replace(/^\.\//, "");
}

function getParentPath(path: string): string {
  const index = path.lastIndexOf("/");
  return index === -1 ? "." : path.slice(0, index);
}

function getBaseName(path: string): string {
  const index = path.lastIndexOf("/");
  return index === -1 ? path : path.slice(index + 1);
}

async function entryExists(
  webcontainer: WebContainer,
  path: string,
): Promise<boolean> {
  const parentPath = getParentPath(path);
  const name = getBaseName(path);

  try {
    const entries = await webcontainer.fs.readdir(parentPath, {
      withFileTypes: true,
    });
    return entries.some((entry) => entry.name === name);
  } catch {
    return false;
  }
}

export function watchWorkspaceFilesystem(
  webcontainer: WebContainer,
  options: WatchWorkspaceFilesystemOptions,
): () => void {
  const { onStructureChange, onPathRemoved, debounceMs = 125 } = options;

  let timeout: ReturnType<typeof setTimeout> | null = null;
  let hasStructureChange = false;
  const pendingRemovals = new Set<string>();

  function flush() {
    timeout = null;

    if (hasStructureChange) {
      hasStructureChange = false;
      onStructureChange();
    }

    for (const path of pendingRemovals) {
      onPathRemoved(path);
    }
    pendingRemovals.clear();
  }

  function scheduleFlush() {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(flush, debounceMs);
  }

  async function handleRename(filename: string | Buffer | Uint8Array) {
    const path = normalizeWatchPath(filename);
    hasStructureChange = true;

    if (!(await entryExists(webcontainer, path))) {
      pendingRemovals.add(path);
    }

    scheduleFlush();
  }

  const watcher = webcontainer.fs.watch(
    ".",
    { recursive: true },
    (event, filename) => {
      if (event !== "rename") return;

      if (filename === undefined) {
        hasStructureChange = true;
        scheduleFlush();
        return;
      }

      void handleRename(filename);
    },
  );

  return () => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    watcher.close();
  };
}
