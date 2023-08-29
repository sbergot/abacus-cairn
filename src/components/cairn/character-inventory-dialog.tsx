import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BoxesIcon } from "lucide-react";
import { useState } from "react";
import { useCurrentCharacter } from "@/app/cairn-context";
import { CharacterInventory } from "./character-inventory";
import { useRelativeLinker, useUrlParams } from "@/lib/hooks";
import { ButtonLike } from "../ui/button-like";

interface Props {}

export function CharacterInventoryDialog({}: Props) {
  const { gameId } = useUrlParams();
  const linker = useRelativeLinker();
  const [open, setOpen] = useState(false);
  const characterLens = useCurrentCharacter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <ButtonLike variant="ghost" size="icon-sm">
          <BoxesIcon size={20} />
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{characterLens.state.name}&apos;s inventory</DialogTitle>
        </DialogHeader>
        <CharacterInventory
          shopLink={(slotId) =>
            linker(`shop?gameId=${gameId}&npcId=${characterLens.state.id}&slotId=${slotId}`)
          }
        />
      </DialogContent>
    </Dialog>
  );
}
