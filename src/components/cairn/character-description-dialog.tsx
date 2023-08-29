import { useCurrentCharacter } from "@/app/cairn-context";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { UserSquare2Icon } from "lucide-react";
import { Children } from "../ui/types";
import { ButtonLike } from "../ui/button-like";

export function CharacterDescriptionDialog({ children }: Children) {
  const characterLens = useCurrentCharacter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonLike variant="ghost" size="icon-sm">
          <UserSquare2Icon />
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <div>{characterLens.state.description}</div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
