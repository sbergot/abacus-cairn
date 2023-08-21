"use client";

import { Button } from "@/components/ui/button";
import { OrSeparator } from "@/components/ui/or-separator";
import { Children } from "@/components/ui/types";
import { rollCharacterStats, fillRandomCharacter } from "@/lib/game/cairn/character-generation";
import { CairnCharacter, Gauge } from "@/lib/game/cairn/types";
import { useRelativeLinker } from "@/lib/hooks";
import { clone } from "@/lib/utils";
import { Link } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGameContext } from "../../cairn-context";
import { useCharacterCreationContext } from "../character-creation-context";
import { Title } from "@/components/ui/typography";


export default function CreateCharacterStats() {
  const { lens } = useCharacterCreationContext();
  const { state: character, setState: setCharacter } = lens;
  const linker = useRelativeLinker();
  const router = useRouter();
  const {
    characterRepo: { setState: setCharacters },
  } = useGameContext();

  function save(newChar: CairnCharacter) {
    setCharacters((repo) => {
      repo[newChar.id] = newChar;
    });
    router.push(linker("../.."));
  }

  useEffect(() => setCharacter(rollCharacterStats), []);

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>New character - Roll stats</Title>
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
      <Button className="w-full" onClick={() => {
        const newChar = clone(character);
        fillRandomCharacter(newChar)
        save(newChar);
      }}>
        Random
      </Button>
      <OrSeparator />
      <Button className="w-full" asChild>
        <Link href={linker("../background")}>Manual</Link>
      </Button>
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
