import { ILens } from "@/lib/types";
import { Input } from "./input";
import { ClassName, KeyOfType } from "./types";
import { Draft } from "immer";
import { clampGauge } from "@/lib/game/cairn/utils";
import { Gauge } from "@/lib/game/types";

interface Props<T> extends ClassName {
  lens: ILens<T>;
  fieldName: KeyOfType<T, Gauge> & KeyOfType<Draft<T>, Gauge>;
}

export default function GaugeField<T>({
  lens,
  fieldName,
  className,
}: Props<T>) {
  return (
    <Input
      id={fieldName}
      onChange={(e) =>
        lens.setState((c) => {
          (c[fieldName] as Gauge).max = Number(e.target.value) as any;
          clampGauge(c[fieldName] as Gauge)
        })
      }
      value={(lens.state[fieldName] as Gauge).max as number}
      autoComplete="off"
      list="autocompleteOff"
      aria-autocomplete="none"
      className={className}
      type="number"
    />
  );
}
