import { Children } from "@/components/ui/types";
import { Gauge } from "@/lib/game/cairn/types";
import { useCharacterCreationContext } from "./character-creation-context";

export function CharacterStatsView() {
  const { lens } = useCharacterCreationContext();
  const { state: character } = lens;

  return (
    <div className="flex gap-8">
      <div className="max-w-min">
        <AbilityField name="Strength" value={character.strength} />
        <AbilityField name="Dexterity" value={character.dexterity} />
        <AbilityField name="Willpower" value={character.willpower} />
      </div>
      <div className="max-w-min">
        <AbilityField name="HP" value={character.hp} />
        <Field name="age">{character.age}</Field>
      </div>
    </div>
  );
}

interface AbilityProps {
  name: string;
  value: Gauge;
}

function AbilityField({ name, value }: AbilityProps) {
  return <Field name={name}>{value.max}</Field>;
}

interface FieldProps extends Children {
  name: string;
}

function Field({ name, children }: FieldProps) {
  return (
    <div className="flex gap-4 justify-between">
      <div>{name}</div>
      <div>{children}</div>
    </div>
  );
}
