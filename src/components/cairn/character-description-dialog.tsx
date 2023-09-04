import { useCurrentCharacter } from "@/app/cairn-context";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { UserSquare2Icon } from "lucide-react";
import { Children } from "../ui/types";
import { ButtonLike } from "../ui/button-like";

export function CharacterDescriptionDialog({ children }: Children) {
  const characterLens = useCurrentCharacter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonLike variant="ghost" size="xs" className="flex gap-2 w-full">
          <UserSquare2Icon />
          <div className="flex-grow">View details</div>
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{characterLens.state.name}</DialogTitle>
        <div>{characterLens.state.description}</div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
