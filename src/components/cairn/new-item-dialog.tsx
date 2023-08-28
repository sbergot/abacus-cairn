import { Gear } from "@/lib/game/cairn/types";
import { uuidv4 } from "@/lib/utils";
import { PackagePlusIcon } from "lucide-react";
import { NewObjectDialog } from "../ui/new-object-dialog";
import { GearEdit } from "./gear-edit";

interface Props {
  onCreate(g: Gear): void;
}

export function NewItemDialog({ onCreate }: Props) {
  return (
    <NewObjectDialog<Gear>
      icon={<PackagePlusIcon />}
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
