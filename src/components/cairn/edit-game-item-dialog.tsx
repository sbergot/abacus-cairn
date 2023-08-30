import { GearContent } from "@/lib/game/cairn/types";
import { PencilIcon } from "lucide-react";
import { NewObjectDialog } from "../ui/new-object-dialog";
import { GearEdit } from "./gear-edit";
import { ButtonLike } from "../ui/button-like";
import { CustomEntryEdit } from "./custom-entry-edit";

interface Props {
  title?: string;
  initialValue: GearContent;
  onSave(g: GearContent): void;
}

export function EditGameItemDialog({ initialValue, onSave }: Props) {
  return (
    <NewObjectDialog<GearContent>
      trigger={
        <div className="flex items-center w-full">
          <ButtonLike variant="ghost" size="icon-sm">
            <PencilIcon />
          </ButtonLike>
          <div className="flex-grow">Edit item</div>
        </div>
      }
      initialValue={initialValue}
      onCreate={onSave}
      validate={(g) => !!g.name}
      title="Custom item"
    >
      {(lens) => (
        <>
          <GearEdit lens={lens} />
          <CustomEntryEdit lens={lens} />
        </>
      )}
    </NewObjectDialog>
  );
}
