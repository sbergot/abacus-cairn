"use client";

import { Button } from "@/components/ui/button";
import { Gauge } from "@/lib/game/cairn/types";
import { useRelativeLinker } from "@/lib/hooks";
import { Title } from "@/components/ui/typography";
import { Children } from "@/components/ui/types";
import { useCharacterCreationContext } from "../character-creation-context";
import Link from "next/link";
import { useEffect } from "react";
import { rollCharacter } from "@/lib/game/cairn/character-generation";

export default function CreateCharacterStats() {
  const { character, setCharacter } = useCharacterCreationContext();
  const linker = useRelativeLinker();

  useEffect(() => setCharacter(rollCharacter), []);

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>New character</Title>
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
      <Button className="w-full" asChild>
        <Link href={linker("../background")}>Next</Link>
      </Button>
    </div>
  );
}

interface AbilityProps {
  name: string;
  value: Gauge;
}

export function AbilityField({ name, value }: AbilityProps) {
  return <Field name={name}>{value.max}</Field>;
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
