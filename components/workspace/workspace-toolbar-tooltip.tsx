"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type WorkspaceToolbarTooltipProps = {
  label: string;
  children: React.ReactElement;
};

export function WorkspaceToolbarTooltip({
  label,
  children,
}: WorkspaceToolbarTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
