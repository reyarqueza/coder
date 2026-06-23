const IGNORED_DIR_NAMES = new Set([".git", ".npm", ".coder"]);

export function isIgnoredWatchPath(path: string): boolean {
  return path
    .split("/")
    .some(
      (segment) => segment === "node_modules" || IGNORED_DIR_NAMES.has(segment),
    );
}

export function isHiddenTreeEntry(name: string): boolean {
  return IGNORED_DIR_NAMES.has(name);
}
