import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BoxesIcon, PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import TextField from "../ui/textfield";
import GaugeField from "./gaugefield";
import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import { CharacterInventory } from "./character-inventory";
import { useRelativeLinker } from "@/lib/hooks";

interface Props {}

export function CharacterInventoryDialog({}: Props) {
  const linker = useRelativeLinker();
  const [open, setOpen] = useState(false);
  const characterLens = useCurrentCharacter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon-sm">
          <BoxesIcon size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{characterLens.state.name}'s inventory</DialogTitle>
        </DialogHeader>
        <CharacterInventory
          shopLink={(slotId) =>
            linker(`shop/${slotId}?npcId=${characterLens.state.id}`)
          }
        />
      </DialogContent>
    </Dialog>
  );
}
