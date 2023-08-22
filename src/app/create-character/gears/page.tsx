"use client"

import { ShowSlotState } from "@/components/cairn/show-slot-state";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useRelativeLinker } from "@/lib/hooks";
import { useCharacterCreationContext } from "../character-creation-context";
import Link from "next/link";
import { useEffect } from "react";
import { fillCharacterGear } from "@/lib/game/cairn/character-generation";

export default function RollGear() {
  const { lens } = useCharacterCreationContext();
  const { state: character, setState: setCharacter } = lens;
  const linker = useRelativeLinker();
  useEffect(() => setCharacter(fillCharacterGear), []);

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Button className="w-full" asChild>
        <Link href={linker("../name")}>Next</Link>
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">type</TableHead>
            <TableHead>gear</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {character.inventory.map((slot) => (
            <TableRow key={slot.id}>
              <TableCell className="p-1">{slot.type}</TableCell>
              <TableCell className="p-1">
                <ShowSlotState state={slot.state} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
