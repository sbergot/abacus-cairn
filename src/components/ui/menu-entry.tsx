import { DropdownMenuItem } from "./dropdown-menu";
import { Children } from "./types";

interface Props extends Children {}

export function MenuEntry({ children }: Props) {
  return <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    {children}
  </DropdownMenuItem>
}
