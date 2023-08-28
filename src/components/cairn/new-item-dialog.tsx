import { Gear } from "@/lib/game/cairn/types";
import { uuidv4 } from "@/lib/utils";
import { PackagePlusIcon } from "lucide-react";
import { NewObjectDialog } from "../ui/new-object-dialog";
import { GearEdit } from "./gear-edit";
import { ButtonLike } from "../ui/button-like";

interface Props {
  onCreate(g: Gear): void;
}

export function NewItemDialog({ onCreate }: Props) {
  return (
    <NewObjectDialog<Gear>
      trigger={<ButtonLike><PackagePlusIcon /> New item</ButtonLike>}
      initialValue={{
        id: uuidv4(),
        name: "",
        description: "",
      }}
      onCreate={onCreate}
      validate={(g) => !!g.name}
      title="Custom item"
    >
      {(lens) => <GearEdit lens={lens} />}
    </NewObjectDialog>
  );
}
