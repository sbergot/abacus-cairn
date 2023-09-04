import { MoreVerticalIcon } from "lucide-react";
import { ButtonLike } from "./button-like";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Children } from "./types";

interface Props extends Children {}

export function CardMenu({ children }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ButtonLike variant="ghost" size="icon-sm">
          <MoreVerticalIcon />
        </ButtonLike>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
