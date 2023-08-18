"use client";

import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import {
  getRandomMaleName,
  getRandomFemaleName,
} from "@/lib/game/cairn/character-generation";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { useRelativeLinker } from "@/lib/hooks";
import { DicesIcon } from "lucide-react";
import { useCharacterCreationContext } from "../character-creation-context";
import { Title } from "@/components/ui/typography";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useGameContext } from "../../cairn-context";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function CharacterName() {
  const { lens } = useCharacterCreationContext();
  const { state: character, setState: setCharacter } = lens;
  const [open, setOpen] = useState(false);
  const linker = useRelativeLinker();
  const router = useRouter();

  const {
    characterRepo: { setState: setCharacters },
  } = useGameContext();

  function save() {
    setCharacters((repo) => {
      repo[character.id] = character;
    });
    router.push(linker("../.."));
  }

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>Backgrounds</Title>
      <Label htmlFor="name">Name your character</Label>
      <div className="flex gap-2 w-full">
        <TextField<CairnCharacter>
          fieldName="name"
          lens={lens}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <DicesIcon size={30} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-xl w-full" side="right">
            <div className="flex gap-1">
              <Button
                onClick={() => {
                  setCharacter((d) => {
                    d.name = getRandomMaleName();
                  });
                  setOpen(false);
                }}
              >
                random male name
              </Button>
              <Button
                onClick={() => {
                  setCharacter((d) => {
                    d.name = getRandomFemaleName();
                  });
                  setOpen(false);
                }}
              >
                random female name
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Button className="w-full" disabled={!character.name} onClick={save}>
        Save
      </Button>
    </div>
  );
}
