"use client";

import { Button } from "@/components/ui/button";
import { useCharacterCreationContext } from "../character-creation-context";
import { useEffect } from "react";
import {
  fillRandomCharacter,
  getEmptyCharacterSlots,
  rollCharacterStats,
} from "@/lib/game/cairn/character-generation";
import { InventoryView } from "../../../components/cairn/inventory-view";
import { CharacterStatsView } from "../../../components/cairn/character-stats-view";
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
      <Title>Gears</Title>
      <div className="flex gap-2 w-full">
        <Button
          className="flex-grow"
          onClick={() => {
            setCharacter((d) => {
              rollCharacterStats(d);
              d.inventory = getEmptyCharacterSlots();
              fillRandomCharacter(d);
            });
          }}
        >
          Reroll
        </Button>
        <Button
          className="flex-grow"
          onClick={() => {
            const newChar = clone(character);
            save(newChar);
          }}
        >
          Save
        </Button>
      </div>
      <Title>{character.name}</Title>
      <CharacterStatsView character={character} />
      <WeakEmph>{character.description}</WeakEmph>
      <InventoryView inventory={character.inventory} />
    </div>
  );
}
