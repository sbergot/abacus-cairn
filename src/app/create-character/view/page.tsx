"use client"

import { Button } from "@/components/ui/button";
import { useCharacterCreationContext } from "../character-creation-context";
import { useEffect } from "react";
import { fillRandomCharacter } from "@/lib/game/cairn/character-generation";
import { CharacterInventoryView } from "../character-inventory-view";
import { CharacterStatsView } from "../character-stats-view";
import { Title, WeakEmph } from "@/components/ui/typography";
import { useGameContext } from "@/app/cairn-context";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { useRouter } from "next/navigation";
import { clone } from "@/lib/utils";

export default function RollGear() {
  const { lens } = useCharacterCreationContext();
  const { state: character, setState: setCharacter } = lens;
  const {
    characterRepo: { setState: setCharacters },
  } = useGameContext();
  const router = useRouter();
  
  useEffect(() => setCharacter(fillRandomCharacter), []);

  function save(newChar: CairnCharacter) {
    setCharacters((repo) => {
      repo[newChar.id] = newChar;
    });
    router.push("/");
  }

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Button className="w-full" onClick={() => {
        const newChar = clone(character);
        save(newChar);
      }}>
        Save
      </Button>
      <Title>{character.name}</Title>
      <CharacterStatsView />
      <WeakEmph>{character.traits}</WeakEmph>
      <CharacterInventoryView />
    </div>
  );
}
