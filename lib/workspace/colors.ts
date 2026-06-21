/** VS Code Dark+ syntax token colors (theme-independent). */
export const workspaceSyntax = {
  keyword: "#c586c0",
  identifier: "#9cdcfe",
  string: "#ce9178",
  comment: "#6a9955",
  function: "#dcdcaa",
  punctuation: "#d4d4d4",
  interpolation: "#569cd6",
  number: "#b5cea8",
  type: "#4ec9b0",
} as const;

export const WORKSPACE_FONT_SIZE = 13;
export const WORKSPACE_LINE_HEIGHT = 1.5;

/** Fallback before terminal measurement sync. */
export const WORKSPACE_UI_FONT_SIZE = 11;

export const WORKSPACE_UI_FONT_SYNC_EVENT = "workspace-ui-font-sync";

/** Matches `--font-mono` in globals.css; used where CSS vars cannot resolve (xterm canvas). */
export const WORKSPACE_FONT_FAMILY =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export function getWorkspaceMonoFontFamily(): string {
  if (typeof document === "undefined") return WORKSPACE_FONT_FAMILY;

  const probe = document.createElement("span");
  probe.className = "font-mono";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  probe.remove();
  return family || WORKSPACE_FONT_FAMILY;
}

/**
 * Match file tree / CodeMirror to the terminal's visual size. xterm renders via
 * canvas/WebGL so equivalent px in DOM looks larger; scale down using canvas vs
 * DOM metrics, with an empirical fallback when they are identical.
 */
export function syncWorkspaceUiFontSize(): number {
  if (typeof document === "undefined") return WORKSPACE_UI_FONT_SIZE;

  const family = getWorkspaceMonoFontFamily();
  const font = `${WORKSPACE_FONT_SIZE}px ${family}`;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    applyWorkspaceUiFontSize(WORKSPACE_UI_FONT_SIZE);
    return WORKSPACE_UI_FONT_SIZE;
  }

  ctx.font = font;
  const canvasWidth = ctx.measureText("M").width;

  const probe = document.createElement("span");
  probe.style.font = font;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.textContent = "M";
  document.body.appendChild(probe);
  const domWidth = probe.getBoundingClientRect().width;
  probe.remove();

  let uiSize = WORKSPACE_UI_FONT_SIZE;
  if (canvasWidth > 0 && domWidth > 0) {
    uiSize = Math.round(WORKSPACE_FONT_SIZE * (canvasWidth / domWidth) * 10) / 10;
    // Canvas and DOM metrics are often identical; xterm still renders smaller.
    if (Math.abs(canvasWidth - domWidth) < 0.5) {
      uiSize = WORKSPACE_UI_FONT_SIZE;
    }
  }

  applyWorkspaceUiFontSize(uiSize);
  return uiSize;
}

function applyWorkspaceUiFontSize(px: number) {
  document.documentElement.style.setProperty("--workspace-ui-font-size", `${px}px`);
  window.dispatchEvent(new CustomEvent(WORKSPACE_UI_FONT_SYNC_EVENT));
}

/** Tailwind class helpers — backgrounds/text follow app light/dark via CSS vars. */
export const workspaceUi = {
  text: "text-[var(--workspace-fg)]",
  textMuted: "text-[var(--workspace-fg-muted)]",
  textActive: "text-[var(--workspace-fg-active)]",
  textError: "text-[#f14c4c]",
  bg: "bg-[var(--workspace-bg)]",
  bgActive: "bg-[var(--workspace-bg-active)]",
  bgHover: "hover:bg-[var(--workspace-bg-hover)]",
  hoverText: "hover:text-[var(--workspace-fg)]",
  border: "border-[var(--workspace-border)]",
  focusBorder: "focus:border-[#79c0ff]/50",
  scroll: "workspace-scroll min-h-0 overflow-x-hidden overflow-y-auto",
  fontMono: "workspace-mono-text",
  headerBorder: "border-[var(--workspace-border)]",
  divider: "bg-[var(--workspace-border)]",
} as const;

export function getTerminalTheme(isDark: boolean) {
  const background = isDark ? "#000000" : "#ffffff";
  const foreground = isDark ? "#d4d4d4" : "#171717";

  return {
    background,
    foreground,
    cursor: isDark ? "#aeafad" : "#171717",
    selectionBackground: isDark ? "#264f78" : "#add6ff",
    black: background,
    red: "#f14c4c",
    green: "#7ee787",
    yellow: "#dcdcaa",
    blue: "#79c0ff",
    magenta: "#d670d6",
    cyan: "#79c0ff",
    white: foreground,
    brightBlack: isDark ? "#8b949e" : "#737373",
    brightRed: "#f14c4c",
    brightGreen: "#7ee787",
    brightYellow: "#dcdcaa",
    brightBlue: "#79c0ff",
    brightMagenta: "#c586c0",
    brightCyan: "#79c0ff",
    brightWhite: isDark ? "#ffffff" : "#000000",
  };
}
