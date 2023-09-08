import { ILens } from "@/lib/types";
import { SearchIcon } from "lucide-react";
import { Input } from "./input";
import { ClassName } from "./types";
import { cn } from "@/lib/utils";

interface Props extends ClassName {
  lens: ILens<string>;
}

export function SearchInput({ lens, className }: Props) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SearchIcon />
      <Input
        className="w-40 p-1"
        value={lens.state}
        onChange={(e) => lens.setState(() => e.target.value)}
      />
    </div>
  );
}
