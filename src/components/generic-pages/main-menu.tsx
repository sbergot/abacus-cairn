"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { BaseCharacter } from "@/lib/game/types";
import { useCharacterStorage } from "@/lib/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
}

export default function MainMenu<TChar extends BaseCharacter, TGame>({
}: Props) {
  const [characters, setCharacters] = useCharacterStorage<TChar>();
  const pathName = usePathname();
  return (
    <main className="p-4 max-w-6xl flex flex-col">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>characters</Title>
          <Button asChild>
            <Link href={pathName + "/create-character"}>new</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>games</Title>
        </div>
      </div>
    </main>
  );
}
