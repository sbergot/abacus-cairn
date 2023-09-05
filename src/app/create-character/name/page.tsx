"use client";

import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import {
  getRandomMaleName,
  getRandomFemaleName,
} from "@/lib/game/cairn/character-generation";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { useCharacterCreationContext } from "../character-creation-context";
import { Title } from "@/components/ui/typography";
import { useGameContext } from "../../cairn-context";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function CharacterName() {
  const { lens } = useCharacterCreationContext();
  const { state: character, setState: setCharacter } = lens;
  const router = useRouter();

  const {
    characterRepo: { setState: setCharacters },
  } = useGameContext();

  function save() {
    setCharacters((repo) => {
      repo[character.id] = character;
    });
    router.push("/");
  }

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>Backgrounds</Title>
      <Label htmlFor="name">Name your character</Label>
        <TextField<CairnCharacter> fieldName="name" lens={lens} />
      <div className="flex gap-1 items-center w-full">
        <Button
          onClick={() => {
            setCharacter((d) => {
              d.name = getRandomMaleName();
            });
          }}
        >
          random male name
        </Button>
        <div className="flex-grow text-center">Or</div>
        <Button
          onClick={() => {
            setCharacter((d) => {
              d.name = getRandomFemaleName();
            });
          }}
        >
          random female name
        </Button>
      </div>
      <Button className="w-full" disabled={!character.name} onClick={save}>
        Save
      </Button>
    </div>
  );
}
