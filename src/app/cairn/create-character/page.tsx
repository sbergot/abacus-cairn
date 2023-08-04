"use client";

import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import { Gauge, Character } from "@/lib/game/cairn/types";
import { rollCharacter } from "@/lib/game/cairn/utils";
import { useRelativeLinker } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useImmer } from "use-immer";
import { useGameContext } from "../cairn-context";
import { Title } from "@/components/ui/typography";
import { Children } from "@/components/ui/types";

export default function CreateCharacter() {
  const [char, setChar] = useImmer<Character>(rollCharacter());
  const {
    characterRepo: { setState: setCharacters },
  } = useGameContext();
  const router = useRouter();
  const linker = useRelativeLinker();

  function save() {
    setCharacters((repo) => {
      repo[char.id] = char;
    });
    router.push(linker(".."));
  }

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>New character</Title>
      <TextField<Character> fieldName="name" setter={setChar} obj={char} />
      <div className="flex gap-8">
        <div className="max-w-min">
          <AbilityField name="Strength" value={char.strength} />
          <AbilityField name="Dexterity" value={char.dexterity} />
          <AbilityField name="Willpower" value={char.willpower} />
        </div>
        <div className="max-w-min">
          <AbilityField name="HP" value={char.hp} />
          <Field name="Armor">1</Field>
        </div>
      </div>
      <Button className="w-24 self-center" onClick={save}>
        Save
      </Button>
    </div>
  );
}

interface AbilityProps {
  name: string;
  value: Gauge;
}

export function AbilityField({ name, value }: AbilityProps) {
  return (
    <Field name={name}>{value.max}</Field>
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
