import { ILens } from "@/lib/types";
import { ClassName, KeyOfType } from "./types";
import { Draft } from "immer";
import { Textarea } from "./textarea";

interface Props<T> extends ClassName {
  lens: ILens<T>;
  fieldName: KeyOfType<T, string> & KeyOfType<Draft<T>, string>;
}

export default function TextAreaField<T>({
  lens,
  fieldName,
  className,
}: Props<T>) {
  return (
    <Textarea
      id={fieldName}
      onChange={(e) =>
        lens.setState((c) => {
          c[fieldName] = e.target.value as any;
        })
      }
      value={lens.state[fieldName] as string}
      autoComplete="off"
      aria-autocomplete="none"
      className={className}
      rows={6}
    />
  );
}
