import { CustomEntry } from "@/lib/game/types";
import { NewObjectDialog } from "./new-object-dialog";
import { PlusIcon } from "lucide-react";
import { uuidv4 } from "@/lib/utils";
import { CustomEntryEdit } from "../cairn/custom-entry-edit";
import { ButtonLike } from "./button-like";
import { NameEdit } from "../cairn/name-edit";
import { ILens } from "@/lib/types";

interface Props {
  onCreate(e: CustomEntry): void;
}

export function NewCustomEntryDialog({ onCreate }: Props) {
  return (
    <NewObjectDialog<CustomEntry>
      trigger={<ButtonLike><PlusIcon /> New entry</ButtonLike>}
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
      {(lens) => <>
        <NameEdit lens={lens as any as ILens<{ name: string }>} />
          <CustomEntryEdit lens={lens} />
        </>}
    </NewObjectDialog>
  );
}