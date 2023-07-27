import { Children } from "@/components/ui/types";
import { Ability } from "@/lib/game/cairn/types";

interface AbilityProps {
  name: string;
  value: Ability;
}

export function Ability({ name, value }: AbilityProps) {
  return (
    <Field name={name}>{value.current}/{value.max}</Field>
  );
}

interface FieldProps extends Children {
  name: string;
}

export function Field({ name, children }: FieldProps) {
  return (
    <div className="flex gap-4 justify-between">
      <div>{name}</div>
      <div>{children}</div>
    </div>
  );
}
