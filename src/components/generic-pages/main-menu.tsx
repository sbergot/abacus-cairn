"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { Character } from "@/lib/game/cairn/types";
import { BaseCharacter } from "@/lib/game/types";
import { useImmerLocalStorage } from "@/lib/hooks";
import Link from "next/link";

interface Props {
  gameName: string;
  newCharacterPath: string;
}

export default function MainMenu<TChar extends BaseCharacter, TGame>({
  gameName,
  newCharacterPath,
}: Props) {
  const [characters, setCharacters] = useImmerLocalStorage<
    Record<string, TChar>
  >(`${gameName}-characters`, {});
  return (
    <main className="p-4 max-w-6xl flex flex-col">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>characters</Title>
          <Button asChild>
            <Link href={newCharacterPath}>new</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>games</Title>
        </div>
      </div>
    </main>
  );
}
