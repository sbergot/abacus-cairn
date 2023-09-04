import { ILens } from "@/lib/types";
import { Input } from "./input";
import { ClassName, KeyOfType } from "./types";
import { Draft } from "immer";

interface Props<T> extends ClassName {
  lens: ILens<T>;
  fieldName: KeyOfType<T, number | undefined> & KeyOfType<Draft<T>, number | undefined>;
}

export default function NumberField<T>({
  lens,
  fieldName,
  className,
}: Props<T>) {
  return (
    <Input
      id={fieldName}
      onChange={(e) =>
        lens.setState((c) => {
          c[fieldName] = Number(e.target.value) as any;
        })
      }
      value={lens.state[fieldName] as number}
      autoComplete="off"
      list="autocompleteOff"
      aria-autocomplete="none"
      className={className}
      type="number"
    />
  );
}
