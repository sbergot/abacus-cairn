import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SearchIcon } from "lucide-react";
import { Gear } from "@/lib/game/cairn/types";
import { ButtonLike } from "../ui/button-like";

interface Props {
  gear: Gear;
}

export function GearDescriptionDialog({ gear }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonLike size="icon-sm">
          <SearchIcon />
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gear.name}</DialogTitle>
        </DialogHeader>
        {gear.description}
      </DialogContent>
    </Dialog>
  );
}
