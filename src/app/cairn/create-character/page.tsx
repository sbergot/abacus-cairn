"use client";

import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import { Title } from "@/components/ui/title";
import { Character } from "@/lib/game/cairn/types";
import { rollCharacter } from "@/lib/game/cairn/utils";
import { useCharacterStorage, useRelativeLinker } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useImmer } from "use-immer";
import { Ability } from "../ability";

export default function CreateCharacter() {
  const [char, setChar] = useImmer<Character>(rollCharacter());
  const [characters, setCharacters] = useCharacterStorage<Character>();
  const router = useRouter();
  const linker = useRelativeLinker();

  function save() {
    setCharacters((repo) => {
      repo[char.id] = char;
    });
    router.push(linker(".."));
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto">
      <Title>Attributes</Title>
      <div className="flex gap-8">
        <div className="max-w-min">
          <Ability name="Strength" value={char.strength.max} />
          <Ability name="Dexterity" value={char.dexterity.max} />
          <Ability name="Willpower" value={char.willpower.max} />
        </div>
        <div className="max-w-min">
          <Ability name="HP" value={char.hp.max} />
          <Ability name="Armor" value={1} />
        </div>
      </div>
      <TextField<Character> fieldName="name" setter={setChar} />
      <Button className="w-24 self-center" onClick={save}>
        Save
      </Button>
    </div>
  );
}
