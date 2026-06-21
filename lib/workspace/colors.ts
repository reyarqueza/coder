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
  fontMono:
    "font-mono text-[length:var(--workspace-font-size)] leading-[var(--workspace-line-height)]",
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
