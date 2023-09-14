import { Gear, GearContent } from "@/lib/game/cairn/types";
import { uuidv4 } from "@/lib/utils";
import { PackagePlusIcon } from "lucide-react";
import { NewObjectDialog } from "../ui/new-object-dialog";
import { GearEdit } from "./gear-edit";
import { ButtonLike } from "../ui/button-like";
import { CustomEntryEdit } from "./custom-entry-edit";
import { ILens } from "@/lib/types";

interface Props {
  categoryName: string;
  onCreate(g: GearContent): void;
}

export function NewGameItemDialog({ onCreate, categoryName }: Props) {
  return (
    <NewObjectDialog<GearContent>
      trigger={
        <ButtonLike>
          <PackagePlusIcon /> New {categoryName}
        </ButtonLike>
      }
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
      title={`Custom ${categoryName}`}
    >
      {(lens) => (
        <>
          <GearEdit lens={lens as any as ILens<Gear>} />
          <CustomEntryEdit lens={lens} />
        </>
      )}
    </NewObjectDialog>
  );
}
