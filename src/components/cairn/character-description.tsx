import { useCurrentCharacter } from "@/app/cairn-context";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { UserSquare2Icon } from "lucide-react";
import { Button } from "../ui/button";

export function CharacterDescriptionDialog() {
  const characterLens = useCurrentCharacter();
  return <Dialog>
    <DialogTrigger><Button variant="ghost" size="icon-sm"><UserSquare2Icon /></Button></DialogTrigger>
    <DialogContent>
    <div>Description</div>
    {characterLens.state.description}
    </DialogContent>
  </Dialog>
}