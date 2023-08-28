import { ILens } from "@/lib/types";
import TextField from "../ui/textfield";

interface Props {
  lens: ILens<{name: string}>
}

export function NameEdit({ lens }: Props) {
  return (
    <>
      <div>Name</div>
      <TextField lens={lens} fieldName="name" />
    </>
  );
}
