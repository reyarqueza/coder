"use client";

import { useEffect, useState } from "react";
import { ChevronRight, FileIcon, FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";

type FileEntry = {
  name: string;
  path: string;
  isDirectory: boolean;
};

async function readDirectory(
  webcontainer: NonNullable<ReturnType<typeof useWebContainer>["webcontainer"]>,
  path: string,
): Promise<FileEntry[]> {
  const entries = await webcontainer.fs.readdir(path, { withFileTypes: true });

  return entries
    .map((entry) => ({
      name: entry.name,
      path: path === "." ? entry.name : `${path}/${entry.name}`,
      isDirectory: entry.isDirectory(),
    }))
    .sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
}

function isNodeModulesFolder(entry: FileEntry) {
  return entry.isDirectory && entry.name === "node_modules";
}

const fileButtonClass =
  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

function FileTreeButton({
  active,
  dimmed,
  onClick,
  className,
  children,
}: {
  active?: boolean;
  dimmed?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        fileButtonClass,
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
        dimmed && "text-muted-foreground opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

function FileTreeNode({ entry, depth = 0 }: { entry: FileEntry; depth?: number }) {
  const { webcontainer, selectedPath, setSelectedPath, refreshKey } =
    useWebContainer();
  const [open, setOpen] = useState(depth === 0 && !isNodeModulesFolder(entry));
  const [children, setChildren] = useState<FileEntry[]>([]);

  useEffect(() => {
    if (!webcontainer || !entry.isDirectory || !open) return;

    let cancelled = false;

    void readDirectory(webcontainer, entry.path)
      .then((nextChildren) => {
        if (!cancelled) setChildren(nextChildren);
      })
      .catch(() => {
        if (!cancelled) setChildren([]);
      });

    return () => {
      cancelled = true;
    };
  }, [webcontainer, entry.isDirectory, entry.path, open, refreshKey]);

  if (!entry.isDirectory) {
    return (
      <div style={{ paddingLeft: `${depth * 12}px` }}>
        <FileTreeButton
          active={selectedPath === entry.path}
          onClick={() => setSelectedPath(entry.path)}
        >
          <FileIcon className="size-4 shrink-0" />
          <span className="truncate">{entry.name}</span>
        </FileTreeButton>
      </div>
    );
  }

  return (
    <div>
      <div style={{ paddingLeft: `${depth * 12}px` }}>
        <FileTreeButton
          dimmed={isNodeModulesFolder(entry)}
          onClick={() => setOpen((current) => !current)}
        >
          <ChevronRight
            className={cn(
              "size-4 shrink-0 transition-transform",
              open && "rotate-90",
            )}
          />
          <FolderIcon className="size-4 shrink-0" />
          <span className="truncate">{entry.name}</span>
        </FileTreeButton>
      </div>
      {open
        ? children.map((child) => (
            <FileTreeNode key={child.path} entry={child} depth={depth + 1} />
          ))
        : null}
    </div>
  );
}

export function FileTree() {
  const { webcontainer, status, refreshKey } = useWebContainer();
  const [entries, setEntries] = useState<FileEntry[]>([]);

  useEffect(() => {
    if (!webcontainer || status !== "ready") return;

    let cancelled = false;

    void readDirectory(webcontainer, ".")
      .then((nextEntries) => {
        if (!cancelled) setEntries(nextEntries);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      });

    return () => {
      cancelled = true;
    };
  }, [webcontainer, status, refreshKey]);

  return (
    <div className="flex h-full min-h-0 flex-col p-2">
      <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Files</p>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {status === "booting" || status === "installing" ? (
          <p className="px-2 text-xs text-muted-foreground">
            {status === "booting"
              ? "Booting environment…"
              : "Installing dependencies…"}
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {entries.map((entry) => (
              <FileTreeNode key={entry.path} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
