import { ButtonLike } from "@/components/ui/button-like";
import { useUrlParams, useRelativeLinker } from "@/lib/hooks";
import { Undo2Icon } from "lucide-react";
import Link from "next/link";

export function BackLink() {
  const { gameId } = useUrlParams();
  const linker = useRelativeLinker();
  return (
    <ButtonLike variant="ghost" size="icon-sm">
      <Link href={linker(`?gameId=${gameId}`)}>
        <Undo2Icon />
      </Link>
    </ButtonLike>
  );
}
