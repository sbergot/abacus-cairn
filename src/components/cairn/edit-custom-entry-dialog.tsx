import { ILens } from "@/lib/types";
import { CustomEntry } from "@/lib/game/types";
import { NewObjectDialog } from "../ui/new-object-dialog";
import { CustomEntryEdit } from "./custom-entry-edit";
import { PencilIcon } from "lucide-react";
import { ButtonLike } from "../ui/button-like";
import { NameEdit } from "./name-edit";

interface Props {
  lens: ILens<CustomEntry>;
  title?: string;
}

export function EditCustomEntryDialog({ lens, title }: Props) {
  return (
    <NewObjectDialog<CustomEntry>
      trigger={
        <div className="flex items-center w-full">
        <ButtonLike variant="ghost" size="icon-sm">
          <PencilIcon size={20} />
        </ButtonLike>
        {title}
        </div>
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
