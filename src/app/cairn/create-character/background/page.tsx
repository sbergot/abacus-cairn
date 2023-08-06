"use client";

import { Button } from "@/components/ui/button";
import { useRelativeLinker } from "@/lib/hooks";
import { Title } from "@/components/ui/typography";
import { useCharacterCreationContext } from "../character-creation-context";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backgrounds } from "@/lib/game/cairn/data";
import { PlusCircleIcon } from "lucide-react";

export default function PickCharacterBackground() {
  const { character, setCharacter } = useCharacterCreationContext();
  const linker = useRelativeLinker();

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>Backgrounds</Title>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Backgrounds</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backgrounds.map((b) => (
            <TableRow>
              <TableCell className="py-2">{b}</TableCell>
              <TableCell className="py-0">
                <Button size="icon-sm" variant="ghost">
                  <PlusCircleIcon size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className="w-24 self-center">
        <Link href={linker("../name")}>Next</Link>
      </Button>
    </div>
  );
}
