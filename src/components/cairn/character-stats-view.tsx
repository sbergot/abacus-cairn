import { Children } from "@/components/ui/types";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { getArmorValue } from "@/lib/game/cairn/utils";
import { Gauge } from "@/lib/game/types";

interface CharacterStatsViewProps {
  character: CairnCharacter;
}

export function CharacterStatsView({ character }: CharacterStatsViewProps) {
  const armor = getArmorValue(character);
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
        <Field name="armor">{armor}</Field>
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
