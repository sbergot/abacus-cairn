import { ILens } from "@/lib/types";
import { ClassName, KeyOfType } from "./types";
import { Draft } from "immer";
import { Checkbox } from "./checkbox";

interface Props<T> extends ClassName {
  lens: ILens<T>;
  fieldName: KeyOfType<T, boolean | undefined> & KeyOfType<Draft<T>, boolean | undefined>;
}

export default function CheckboxField<T>({
  lens,
  fieldName,
  className,
}: Props<T>) {
  return (
    <Checkbox
      id={fieldName}
      onCheckedChange={() =>
        lens.setState((c) => {
          c[fieldName] = !c[fieldName] as any;
        })
      }
      defaultChecked={lens.state[fieldName] as boolean}
      className={className}
    />
  );
}
