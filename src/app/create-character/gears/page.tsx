"use client"

import { Button } from "@/components/ui/button";
import { useRelativeLinker } from "@/lib/hooks";
import { useCharacterCreationContext } from "../character-creation-context";
import Link from "next/link";
import { useEffect } from "react";
import { fillCharacterGear } from "@/lib/game/cairn/character-generation";
import { CharacterInventoryView } from "../character-inventory-view";

export default function RollGear() {
  const { lens } = useCharacterCreationContext();
  const { setState: setCharacter } = lens;
  const linker = useRelativeLinker();
  useEffect(() => setCharacter(fillCharacterGear), []);

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Button className="w-full" asChild>
        <Link href={linker("../name")}>Next</Link>
      </Button>
      <CharacterInventoryView />
    </div>
  );
}
