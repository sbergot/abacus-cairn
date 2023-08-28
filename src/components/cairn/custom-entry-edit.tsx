import { ILens } from "@/lib/types";
import { CustomEntry } from "@/lib/game/types";
import TextAreaField from "../ui/textareafield";

interface Props {
  lens: ILens<CustomEntry>
}

export function CustomEntryEdit({ lens }: Props) {
  return (
    <>
      <div>Description</div>
      <TextAreaField lens={lens} fieldName="description" />
      <div>Private notes</div>
      <TextAreaField lens={lens} fieldName="privateNotes" />
    </>
  );
}
