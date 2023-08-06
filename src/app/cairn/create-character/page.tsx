"use client";

import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import { Gauge, Character } from "@/lib/game/cairn/types";
import { useRelativeLinker } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useImmer } from "use-immer";
import { useGameContext } from "../cairn-context";
import { Title } from "@/components/ui/typography";
import { Children } from "@/components/ui/types";
import {
  getRandomFemaleName,
  getRandomMaleName,
  rollCharacter,
} from "@/lib/game/cairn/character-generation";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DicesIcon, PlusCircleIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backgrounds } from "@/lib/game/cairn/data";

export default function CreateCharacter() {
  const [char, setChar] = useImmer<Character>(rollCharacter());
  const [open, setOpen] = useState(false);
  const {
    characterRepo: { setState: setCharacters },
  } = useGameContext();
  const router = useRouter();
  const linker = useRelativeLinker();

  function save() {
    setCharacters((repo) => {
      repo[char.id] = char;
    });
    router.push(linker(".."));
  }

  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>New character</Title>
      <div className="flex gap-2 items-end">
        <TextField<Character> fieldName="name" setter={setChar} obj={char} />
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
                  setChar((d) => {
                    d.name = getRandomMaleName();
                  });
                  setOpen(false);
                }}
              >
                random male name
              </Button>
              <Button
                onClick={() => {
                  setChar((d) => {
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
      <div className="flex gap-8">
        <div className="max-w-min">
          <AbilityField name="Strength" value={char.strength} />
          <AbilityField name="Dexterity" value={char.dexterity} />
          <AbilityField name="Willpower" value={char.willpower} />
        </div>
        <div className="max-w-min">
          <AbilityField name="HP" value={char.hp} />
          <Field name="Armor">1</Field>
        </div>
      </div>
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
              <TableCell className="py-0"><Button size="icon-sm" variant="ghost"><PlusCircleIcon size={20} /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className="w-24 self-center" onClick={save}>
        Save
      </Button>
    </div>
  );
}

interface AbilityProps {
  name: string;
  value: Gauge;
}

export function AbilityField({ name, value }: AbilityProps) {
  return <Field name={name}>{value.max}</Field>;
}

interface FieldProps extends Children {
  name: string;
}

export function Field({ name, children }: FieldProps) {
  return (
    <div className="flex gap-4 justify-between">
      <div>{name}</div>
      <div>{children}</div>
    </div>
  );
}
