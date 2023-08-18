import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import TextField from "../ui/textfield";
import GaugeField from "./gaugefield";

export function EditCharStats() {
  const characterLens = useCurrentCharacter();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon-sm">
          <PencilIcon size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit stats</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div>
            <div>Name</div>
            <TextField lens={characterLens} fieldName="name" />
          </div>
          <div className="flex gap-2">
            <div>
              <div>Dexterity</div>
              <GaugeField lens={characterLens} fieldName="dexterity" />
            </div>
            <div>
              <div>Strength</div>
              <GaugeField lens={characterLens} fieldName="strength" />
            </div>
            <div>
              <div>Willpower</div>
              <GaugeField lens={characterLens} fieldName="willpower" />
            </div>
          </div>
          <div>
            <div>HP</div>
            <GaugeField className="w-20" lens={characterLens} fieldName="hp" />
          </div>
          <Button onClick={() => setOpen(false)} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}