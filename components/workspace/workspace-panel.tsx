import { cn } from "@/lib/utils";
import { workspaceUi } from "@/lib/workspace/colors";

type WorkspacePanelProps = {
  title: string;
  statusDot?: boolean;
  headerExtra?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

export function WorkspacePanel({
  title,
  statusDot,
  headerExtra,
  className,
  titleClassName,
  bodyClassName,
  children,
}: WorkspacePanelProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-xl",
        "shadow-[inset_0_0_0_1px_rgba(193,228,255,0.1),inset_0_-1px_0_0_rgba(255,255,255,0.1),inset_0_1px_0_0_rgba(132,185,246,0.1)]",
        className,
      )}
    >
      <div className={cn("flex h-8 shrink-0 items-center justify-between border-b px-3", workspaceUi.headerBorder)}>
        <p className={cn("flex items-center gap-1.5 text-sm", workspaceUi.text, titleClassName)}>
          {title}
          {statusDot ? (
            <span
              className={cn("text-[10px]", workspaceUi.textMuted, titleClassName && "text-inherit opacity-70")}
              aria-hidden="true"
            >
              ⬤
            </span>
          ) : null}
        </p>
        {headerExtra}
      </div>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
