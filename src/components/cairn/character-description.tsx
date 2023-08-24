import { useCurrentCharacter } from "@/app/cairn-context";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { UserSquare2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Children } from "../ui/types";

export function CharacterDescriptionDialog({ children }: Children) {
  const characterLens = useCurrentCharacter();
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="icon-sm">
          <UserSquare2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div>{characterLens.state.description}</div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
