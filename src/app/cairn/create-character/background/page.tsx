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
import { OrSeparator } from "@/components/ui/or-separator";
import { pickRandom } from "@/lib/random";

export default function PickCharacterBackground() {
  const { lens } = useCharacterCreationContext();
  const { state: character, setState: setCharacter } = lens;
  const linker = useRelativeLinker();

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>Backgrounds</Title>
      <div>Pick your background</div>
      <div>Your character is {character.background || "???"}</div>
      <Button className="w-full"
        onClick={() =>
          setCharacter((d) => {
            d.background = pickRandom(backgrounds);
          })
        }
      >
        Pick randomly
      </Button>
      <OrSeparator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Backgrounds</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backgrounds.map((b) => (
            <TableRow key={b}>
              <TableCell className="py-2">{b}</TableCell>
              <TableCell className="py-0">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    setCharacter((d) => {
                      d.background = b;
                    })
                  }
                >
                  <PlusCircleIcon size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className="w-full" asChild>
        <Link href={linker("../name")}>Next</Link>
      </Button>
    </div>
  );
}
