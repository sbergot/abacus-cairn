import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";
import { Children } from "./types";

interface Props extends Children {
  name: string;
}

export function TooltipShort({ name, children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>
        {children}
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}
