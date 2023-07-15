"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { BaseCharacter } from "@/lib/game/types";
import { useCharacterStorage, useRelativeLinker } from "@/lib/hooks";
import Link from "next/link";

interface Props {}

export default function MainMenu<
  TChar extends BaseCharacter,
  TGame
>({}: Props) {
  const [characters, setCharacters] = useCharacterStorage<TChar>();
  const linker = useRelativeLinker();
  return (
    <main className="p-4 max-w-6xl flex flex-col">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>characters</Title>
          <div>
            {Object.values(characters).map(c => <div>{c.name}</div>)}
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
