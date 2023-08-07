import { Input } from "./input";
import { ClassName, KeyOfType, Setter } from "./types";
import { Draft } from "immer";

interface Props<T> extends ClassName {
  obj: T;
  setter: Setter<T>;
  fieldName: KeyOfType<T, string> & KeyOfType<Draft<T>, string>;
}

export default function TextField<T>({
  setter,
  obj,
  fieldName,
  className,
}: Props<T>) {
  return (
    <Input
      id={fieldName}
      onChange={(e) =>
        setter((c) => {
          c[fieldName] = e.target.value as any;
        })
      }
      value={obj[fieldName] as string}
      autoComplete="off"
      list="autocompleteOff"
      aria-autocomplete="none"
      className={className}
    />
  );
}
