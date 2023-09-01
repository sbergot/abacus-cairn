"use client";

import { Button } from "@/components/ui/button";
import { useRelativeLinker } from "@/lib/hooks";
import { Title } from "@/components/ui/typography";
import { useCharacterCreationContext } from "../character-creation-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backgrounds } from "@/lib/game/cairn/character-generation-data";
import { PlusCircleIcon } from "lucide-react";
import { pickRandom } from "@/lib/random";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "@/components/ui/textfield";
import TextAreaField from "@/components/ui/textareafield";
import { generateTraits } from "@/lib/game/cairn/character-generation";
import { ButtonLike } from "@/components/ui/button-like";

export default function PickCharacterBackground() {
  const { lens } = useCharacterCreationContext();
  const { state: character, setState: setCharacter } = lens;
  const [open, setOpen] = useState(false);
  const linker = useRelativeLinker();
  const router = useRouter();

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>Backgrounds & Traits</Title>
      <div>Pick your background</div>
      <TextField lens={lens} fieldName="background" />
      <div className="flex gap-2 items-center w-full">
        <Button
          className="flex-grow"
          onClick={() =>
            setCharacter((d) => {
              d.background = pickRandom(backgrounds);
            })
          }
        >
          Pick randomly
        </Button>
        <div>Or</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex-grow">
            <ButtonLike className="w-full">Select from list</ButtonLike>
          </DialogTrigger>
          <DialogContent className="max-h-[36rem] overflow-y-scroll">
            <BackgroundsTable close={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div>Define your traits</div>
      <TextAreaField lens={lens} fieldName="description" className="resize-none" />
      <Button
        className="w-full"
        onClick={() =>
          setCharacter((d) => {
            d.description = generateTraits();
          })
        }
      >
        Generate
      </Button>
      <Button
        className="w-full"
        disabled={!character.background || !character.description}
        onClick={() => router.push(linker("../gears"))}
      >
        Next
      </Button>
    </div>
  );
}

interface CloseProps {
  close(): void;
}

function BackgroundsTable({ close }: CloseProps) {
  const { lens } = useCharacterCreationContext();
  const { state: character, setState: setCharacter } = lens;

  return (
    <Table className="h-24">
      <TableHeader>
        <TableRow>
          <TableHead>Backgrounds</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {backgrounds.map((b) => (
          <TableRow
            data-state={b === character.background ? "selected" : ""}
            key={b}
          >
            <TableCell className="py-2">{b}</TableCell>
            <TableCell className="py-0">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => {
                  setCharacter((d) => {
                    d.background = b;
                  });
                  close();
                }}
              >
                <PlusCircleIcon  />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
