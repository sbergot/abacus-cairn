import { Label } from "@radix-ui/react-label";
import { Input } from "./input";
import { KeyOfType, Setter } from "./types";
import { Draft } from "immer";

interface Props<T> {
  obj: T;
  setter: Setter<T>;
  fieldName: KeyOfType<T, string> & KeyOfType<Draft<T>, string>;
  label?: string;
}

export default function TextField<T>({ setter, obj, fieldName, label }: Props<T>) {
  return (
    <div>
      <Label htmlFor={fieldName}>{label ?? fieldName}</Label>
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
      />
    </div>
  );
}
