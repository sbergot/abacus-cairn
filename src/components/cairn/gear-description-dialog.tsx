import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Gear } from "@/lib/game/cairn/types";

interface Props {
  gear: Gear;
}

export function GearDescriptionDialog({ gear }: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon-sm">
          <SearchIcon />
        </Button>
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
