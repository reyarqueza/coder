import type { WebContainer } from "@webcontainer/api";

export type FileEntry = {
  name: string;
  path: string;
  isDirectory: boolean;
};

export function joinPath(parentPath: string, name: string) {
  return parentPath === "." ? name : `${parentPath}/${name}`;
}

export function validateEntryName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Name is required.";
  if (trimmed.includes("/") || trimmed.includes("\\")) {
    return "Name cannot contain slashes.";
  }
  if (trimmed === "." || trimmed === "..") return "Invalid name.";
  return null;
}

export function isProtectedEntry(entry: FileEntry) {
  return entry.isDirectory && entry.name === "node_modules";
}

export async function readDirectory(
  webcontainer: WebContainer,
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

export async function createFile(
  webcontainer: WebContainer,
  parentPath: string,
  name: string,
) {
  const path = joinPath(parentPath, name.trim());
  await webcontainer.fs.writeFile(path, "");
  return path;
}

export async function createFolder(
  webcontainer: WebContainer,
  parentPath: string,
  name: string,
) {
  const path = joinPath(parentPath, name.trim());
  await webcontainer.fs.mkdir(path);
  return path;
}

export async function deleteEntry(
  webcontainer: WebContainer,
  entry: FileEntry,
) {
  if (entry.isDirectory) {
    await webcontainer.fs.rm(entry.path, { recursive: true, force: true });
    return;
  }

  await webcontainer.fs.rm(entry.path, { force: true });
}
