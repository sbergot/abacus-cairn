import { Label } from "@radix-ui/react-label";
import { Input } from "./input";
import { KeyOfType, Setter } from "./types";
import { Draft } from "immer";

interface Props<T> {
  setter: Setter<T>;
  fieldName: KeyOfType<Draft<T>, string>;
  label?: string;
}

export default function TextField<T>({ setter, fieldName, label }: Props<T>) {
  return (
    <>
      <Label htmlFor={fieldName}>{label ?? fieldName}</Label>
      <Input
        id={fieldName}
        onChange={(e) =>
          setter((c) => {
            c[fieldName] = e.target.value as any;
          })
        }
        autoComplete="off"
        list="autocompleteOff"
        aria-autocomplete="none"
      />
    </>
  );
}
