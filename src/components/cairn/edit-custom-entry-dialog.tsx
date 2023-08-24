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
import { useCurrentCharacter } from "@/app/cairn-context";
import TextAreaField from "../ui/textareafield";
import { ILens } from "@/lib/types";
import { CustomEntry } from "@/lib/game/types";

interface Props {
  lens: ILens<CustomEntry>
}

export function EditCustomEntryDialog({ lens }: Props) {
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
            <TextField lens={lens} fieldName="name" />
          </div>
          <div>
            <div>Description</div>
            <TextAreaField lens={lens} fieldName="description" />
          </div>
          <div>
            <div>Private notes</div>
            <TextAreaField lens={lens} fieldName="privateNote" />
          </div>
          <Button onClick={() => setOpen(false)} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
