"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { Toggle } from "@/components/ui/toggle";
import { BaseCharacter } from "@/lib/game/types";
import { useCharacterStorage, useRelativeLinker } from "@/lib/hooks";
import { PlayIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
              <Entry
                name={c.name}
                onPlay={() => {}}
                onDelete={() => {}}
              />
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
  name: string;
  onPlay(): void;
  onDelete(): void;
}

function Entry({ name, onPlay, onDelete }: EntryProps) {
  return <div className="flex justify-between border border-input bg-background">
    <div>{name}</div>
    <div className="flex gap-1">
      <Button size="icon"><PlayIcon /></Button>
      <Button size="icon"><Trash2Icon /></Button>
    </div>
  </div>
}