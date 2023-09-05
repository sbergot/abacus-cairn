"use client"

import { Button } from "@/components/ui/button";
import { useRelativeLinker } from "@/lib/hooks";
import { useCharacterCreationContext } from "../character-creation-context";
import Link from "next/link";
import { useEffect } from "react";
import { fillCharacterGear } from "@/lib/game/cairn/character-generation";
import { InventoryView } from "../../../components/cairn/inventory-view";
import { Title } from "@/components/ui/typography";

export default function RollGear() {
  const { lens } = useCharacterCreationContext();
  const { setState: setCharacter, state: character } = lens;
  const linker = useRelativeLinker();
  useEffect(() => setCharacter(fillCharacterGear), []);

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>Gears</Title>
      <Button className="w-full" asChild>
        <Link href={linker("../name")}>Next</Link>
      </Button>
      <InventoryView inventory={character.inventory} />
    </div>
  );
}
