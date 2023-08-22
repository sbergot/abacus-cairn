"use client";

import { Button } from "@/components/ui/button";
import { OrSeparator } from "@/components/ui/or-separator";
import { rollCharacterStats } from "@/lib/game/cairn/character-generation";
import { useRelativeLinker } from "@/lib/hooks";
import { useEffect } from "react";
import { useCharacterCreationContext } from "../character-creation-context";
import { Title } from "@/components/ui/typography";
import Link from "next/link";
import { CharacterStatsView } from "@/components/cairn/character-stats-view";

export default function CreateCharacterStats() {
  const { lens } = useCharacterCreationContext();
  const { state: character, setState: setCharacter } = lens;
  const linker = useRelativeLinker();

  useEffect(() => setCharacter(rollCharacterStats), []);

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>New character - Roll stats</Title>
      <CharacterStatsView character={character} />
      <Button className="w-full" asChild>
        <Link href={linker("../view")}>Random</Link>
      </Button>
      <OrSeparator />
      <Button className="w-full" asChild>
        <Link href={linker("../background")}>Manual</Link>
      </Button>
    </div>
  );
}
