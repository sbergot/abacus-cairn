import { ILens } from "@/lib/types";
import { Input } from "./input";
import { ClassName, KeyOfType } from "./types";
import { Draft } from "immer";

interface Props<T> extends ClassName {
  lens: ILens<T>;
  fieldName: KeyOfType<T, string> & KeyOfType<Draft<T>, string>;
}

export default function TextField<T>({
  lens,
  fieldName,
  className,
}: Props<T>) {
  return (
    <Input
      id={fieldName}
      onChange={(e) =>
        lens.setState((c) => {
          c[fieldName] = e.target.value as any;
        })
      }
      value={lens.state[fieldName] as string}
      autoComplete="off"
      list="autocompleteOff"
      aria-autocomplete="none"
      className={className}
    />
  );
}
