"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { BaseCharacter } from "@/lib/game/types";
import { useCharacterStorage, useRelativeLinker } from "@/lib/hooks";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { PlayIcon, SeparatorHorizontal, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Props {}

export default function MainMenu<
  TChar extends BaseCharacter,
  TGame
>({}: Props) {
  const [characters, setCharacters] = useCharacterStorage<TChar>();
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const linker = useRelativeLinker();

  return (
    <main className="p-4 max-w-6xl flex flex-col">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>characters</Title>
          <div className="flex flex-col gap-2">
            {Object.values(characters).map((c) => (
              <Entry key={c.id} character={c} />
            ))}
          </div>
          <Button asChild>
            <Link href={linker("create-character")}>new</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>games</Title>
        </div>
      </div>
    </main>
  );
}

interface EntryProps {
  character: BaseCharacter;
}

function Entry({ character }: EntryProps) {
  return (
    <div className="flex justify-between items-center p-2 border border-input bg-background">
      <div className="text-lg">{character.name}</div>
      <div className="flex gap-2">
        <PlayModal character={character} />
        <Button size="icon-sm">
          <Trash2Icon size={15} />
        </Button>
      </div>
    </div>
  );
}

interface PlayModalProps {
  character: BaseCharacter;
}

export function PlayModal({ character }: PlayModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm">
          <PlayIcon size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start session</DialogTitle>
          <DialogDescription>
            Start a solo session or join a shared table.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button>Solo</Button>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-grow">
              <Separator />
            </div>
            <div>Or</div>
            <div className="flex-grow">
              <Separator />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="name">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
