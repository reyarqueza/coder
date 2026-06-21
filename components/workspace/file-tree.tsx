"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  FileIcon,
  FilePlus,
  FolderIcon,
  FolderPlus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createFile,
  createFolder,
  deleteEntry,
  isProtectedEntry,
  readDirectory,
  validateEntryName,
  type FileEntry,
} from "@/lib/webcontainer/fs-ops";
import { useWebContainer } from "@/components/workspace/webcontainer-provider";
import { WorkspacePanel } from "@/components/workspace/workspace-panel";
import { WorkspaceToolbarTooltip } from "@/components/workspace/workspace-toolbar-tooltip";
import { workspaceFileTree, workspaceUi } from "@/lib/workspace/colors";

type PendingCreate = {
  parentPath: string;
  kind: "file" | "folder";
  depth: number;
};

type ContextMenuState = {
  x: number;
  y: number;
  entry: FileEntry;
};

const fileButtonClass = cn(
  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left",
  workspaceUi.fontMono,
  workspaceFileTree.fileText,
  workspaceUi.bgHover,
);

function FileTreeButton({
  active,
  onClick,
  onContextMenu,
  className,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={cn(
        fileButtonClass,
        active && cn(workspaceUi.bgActive, workspaceFileTree.fileText),
        className,
      )}
    >
      {children}
    </button>
  );
}

function CreateEntryInput({
  kind,
  depth,
  onConfirm,
  onCancel,
}: {
  kind: "file" | "folder";
  depth: number;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit() {
    const validationError = validateEntryName(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    onConfirm(value.trim());
  }

  return (
    <div style={{ paddingLeft: `${depth * 12}px` }} className="px-2 py-0.5">
      <div className="flex items-center gap-2">
        {kind === "file" ? (
          <FileIcon className={cn("size-4 shrink-0", workspaceFileTree.icon)} />
        ) : (
          <FolderIcon className={cn("size-4 shrink-0", workspaceFileTree.folderIcon)} />
        )}
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              onCancel();
            }
          }}
          onBlur={() => {
            if (value.trim()) submit();
            else onCancel();
          }}
          placeholder={kind === "file" ? "filename.js" : "folder-name"}
          className={cn(
            "min-w-0 flex-1 rounded border bg-transparent px-1.5 py-0.5 outline-none",
            workspaceUi.border,
            workspaceUi.text,
            workspaceUi.focusBorder,
          )}
        />
      </div>
      {error ? (
        <p className={cn("mt-1 pl-6 text-xs", workspaceUi.textError)}>{error}</p>
      ) : null}
    </div>
  );
}

function FileTreeContextMenu({
  menu,
  onClose,
  onNewFile,
  onNewFolder,
  onDelete,
}: {
  menu: ContextMenuState;
  onClose: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onDelete: () => void;
}) {
  const protectedEntry = isProtectedEntry(menu.entry);

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className={cn(
          "workspace-mono-text fixed z-50 min-w-36 rounded-lg border p-1 shadow-lg",
          workspaceUi.bg,
          workspaceUi.border,
        )}
        style={{ top: menu.y, left: menu.x }}
      >
        {menu.entry.isDirectory && !protectedEntry ? (
          <>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left",
                workspaceUi.text,
                workspaceUi.bgHover,
              )}
              onClick={() => {
                onNewFile();
                onClose();
              }}
            >
              <FilePlus className="size-4" />
              New File
            </button>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left",
                workspaceUi.text,
                workspaceUi.bgHover,
              )}
              onClick={() => {
                onNewFolder();
                onClose();
              }}
            >
              <FolderPlus className="size-4" />
              New Folder
            </button>
            <div className={cn("my-1 h-px", workspaceUi.divider)} />
          </>
        ) : null}
        {!protectedEntry ? (
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left",
              workspaceUi.textError,
              "hover:bg-[#f14c4c]/10",
            )}
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        ) : null}
      </div>
    </>
  );
}

function FileTreeNode({
  entry,
  depth = 0,
  pendingCreate,
  onConfirmCreate,
  onCancelCreate,
  onContextMenu,
}: {
  entry: FileEntry;
  depth?: number;
  pendingCreate: PendingCreate | null;
  onConfirmCreate: (name: string) => Promise<void>;
  onCancelCreate: () => void;
  onContextMenu: (event: React.MouseEvent, entry: FileEntry) => void;
}) {
  const { webcontainer, selectedPath, setSelectedPath, refreshKey } =
    useWebContainer();
  const [open, setOpen] = useState(depth === 0 && !isProtectedEntry(entry));
  const [children, setChildren] = useState<FileEntry[]>([]);

  const showCreateInput =
    pendingCreate?.parentPath === entry.path && entry.isDirectory && open;

  useEffect(() => {
    if (pendingCreate?.parentPath === entry.path && entry.isDirectory) {
      setOpen(true);
    }
  }, [pendingCreate, entry.path, entry.isDirectory]);

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
          onContextMenu={(event) => onContextMenu(event, entry)}
        >
          <FileIcon className={cn("size-4 shrink-0", workspaceFileTree.icon)} />
          <span className="truncate">{entry.name}</span>
        </FileTreeButton>
      </div>
    );
  }

  return (
    <div>
      <div style={{ paddingLeft: `${depth * 12}px` }}>
        <FileTreeButton
          onClick={() => setOpen((current) => !current)}
          onContextMenu={(event) => onContextMenu(event, entry)}
        >
          <ChevronRight
            className={cn(
              "size-4 shrink-0 transition-transform",
              workspaceFileTree.icon,
              open && "rotate-90",
            )}
          />
          <FolderIcon className={cn("size-4 shrink-0", workspaceFileTree.folderIcon)} />
          <span className={cn("truncate", workspaceFileTree.directory)}>{entry.name}</span>
        </FileTreeButton>
      </div>
      {open ? (
        <>
          {children.map((child) => (
            <FileTreeNode
              key={child.path}
              entry={child}
              depth={depth + 1}
              pendingCreate={pendingCreate}
              onConfirmCreate={onConfirmCreate}
              onCancelCreate={onCancelCreate}
              onContextMenu={onContextMenu}
            />
          ))}
          {showCreateInput && pendingCreate ? (
            <CreateEntryInput
              kind={pendingCreate.kind}
              depth={depth + 1}
              onConfirm={(name) => void onConfirmCreate(name)}
              onCancel={onCancelCreate}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export function FileTree() {
  const {
    webcontainer,
    status,
    refreshKey,
    selectedPath,
    setSelectedPath,
    refreshFiles,
  } = useWebContainer();
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [pendingCreate, setPendingCreate] = useState<PendingCreate | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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

  function startCreate(
    parentPath: string,
    kind: "file" | "folder",
    depth: number,
  ) {
    setActionError(null);
    setPendingCreate({ parentPath, kind, depth });
  }

  async function confirmCreate(name: string) {
    if (!webcontainer || !pendingCreate) return;

    const validationError = validateEntryName(name);
    if (validationError) {
      setActionError(validationError);
      return;
    }

    try {
      const { parentPath, kind } = pendingCreate;
      if (kind === "file") {
        const path = await createFile(webcontainer, parentPath, name);
        setSelectedPath(path);
      } else {
        await createFolder(webcontainer, parentPath, name);
      }
      setPendingCreate(null);
      refreshFiles();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to create entry.",
      );
    }
  }

  async function handleDelete(entry: FileEntry) {
    if (!webcontainer || isProtectedEntry(entry)) return;

    if (
      entry.isDirectory &&
      !window.confirm(`Delete "${entry.name}" and everything inside it?`)
    ) {
      return;
    }

    try {
      await deleteEntry(webcontainer, entry);
      if (
        selectedPath === entry.path ||
        (entry.isDirectory && selectedPath?.startsWith(`${entry.path}/`))
      ) {
        setSelectedPath(null);
      }
      refreshFiles();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to delete entry.",
      );
    }
  }

  function openContextMenu(event: React.MouseEvent, entry: FileEntry) {
    if (isProtectedEntry(entry)) return;
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, entry });
  }

  const toolbar = (
    <div className="flex items-center gap-0.5">
      <WorkspaceToolbarTooltip label="New file">
        <button
          type="button"
          className={cn(
            "rounded p-1",
            workspaceUi.textMuted,
            workspaceUi.bgHover,
            workspaceUi.hoverText,
          )}
          onClick={() => startCreate(".", "file", 0)}
        >
          <FilePlus className="size-3.5" />
        </button>
      </WorkspaceToolbarTooltip>
      <WorkspaceToolbarTooltip label="New folder">
        <button
          type="button"
          className={cn(
            "rounded p-1",
            workspaceUi.textMuted,
            workspaceUi.bgHover,
            workspaceUi.hoverText,
          )}
          onClick={() => startCreate(".", "folder", 0)}
        >
          <FolderPlus className="size-3.5" />
        </button>
      </WorkspaceToolbarTooltip>
    </div>
  );

  return (
    <WorkspacePanel
      title="Files"
      titleClassName={workspaceUi.text}
      headerExtra={status === "ready" ? toolbar : null}
      bodyClassName={cn(workspaceUi.bg, workspaceUi.scroll, workspaceUi.fontMono, workspaceUi.text)}
    >
      <div className="p-2">
        {actionError ? (
          <p className={cn("mb-2 px-2 text-xs", workspaceUi.textError)}>{actionError}</p>
        ) : null}
        {status === "booting" || status === "installing" ? (
          <p className={cn("px-2 text-xs", workspaceUi.textMuted)}>
            {status === "booting"
              ? "Booting environment…"
              : "Installing dependencies…"}
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {entries.map((entry) => (
              <FileTreeNode
                key={entry.path}
                entry={entry}
                pendingCreate={pendingCreate}
                onConfirmCreate={confirmCreate}
                onCancelCreate={() => setPendingCreate(null)}
                onContextMenu={openContextMenu}
              />
            ))}
            {pendingCreate?.parentPath === "." ? (
              <CreateEntryInput
                kind={pendingCreate.kind}
                depth={0}
                onConfirm={(name) => void confirmCreate(name)}
                onCancel={() => setPendingCreate(null)}
              />
            ) : null}
          </div>
        )}
      </div>
      {contextMenu ? (
        <FileTreeContextMenu
          menu={contextMenu}
          onClose={() => setContextMenu(null)}
          onNewFile={() =>
            startCreate(
              contextMenu.entry.path,
              "file",
              contextMenu.entry.path.split("/").length,
            )
          }
          onNewFolder={() =>
            startCreate(
              contextMenu.entry.path,
              "folder",
              contextMenu.entry.path.split("/").length,
            )
          }
          onDelete={() => void handleDelete(contextMenu.entry)}
        />
      ) : null}
    </WorkspacePanel>
  );
}
