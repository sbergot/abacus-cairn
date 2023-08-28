import { ILens } from "@/lib/types";
import { CustomEntry } from "@/lib/game/types";
import { NewObjectDialog } from "../ui/new-object-dialog";
import { CustomEntryEdit } from "./custom-entry-edit";
import { EditIcon, PencilIcon } from "lucide-react";
import { ButtonLike } from "../ui/button-like";
import { Edit2Icon } from "lucide-react";
import { NameEdit } from "./name-edit";

interface Props {
  lens: ILens<CustomEntry>;
}

export function EditCustomEntryDialog({ lens }: Props) {
  return (
    <NewObjectDialog<CustomEntry>
      trigger={
        <ButtonLike variant="ghost" size="icon-sm">
          <PencilIcon size={20} />
        </ButtonLike>
      }
      initialValue={lens.state}
      onCreate={(ce) => lens.setState(() => ce)}
      validate={(g) => !!g.name}
    >
      {(lens) => (
        <>
          <NameEdit lens={lens} />
          <CustomEntryEdit lens={lens} />
        </>
      )}
    </NewObjectDialog>
  );
}
