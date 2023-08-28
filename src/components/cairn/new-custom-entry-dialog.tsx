import { CustomEntry } from "@/lib/game/types";
import { NewObjectDialog } from "../ui/new-object-dialog";
import { PlusIcon } from "lucide-react";
import { uuidv4 } from "@/lib/utils";
import { CustomEntryEdit } from "./custom-entry-edit";

interface Props {
  onCreate(e: CustomEntry): void;
}

export function NewCustomEntryDialog({ onCreate }: Props) {
  return (
    <NewObjectDialog<CustomEntry>
      icon={<PlusIcon />}
      initialValue={{
        id: uuidv4(),
        name: "",
        description: "",
        excludedFromRandomPick: false,
        privateNotes: "",
        visibleToAll: false,
      }}
      onCreate={onCreate}
      validate={(g) => !!g.name}
      title="Custom entry"
    >
      {(lens) => <CustomEntryEdit lens={lens} />}
    </NewObjectDialog>
  );
}