"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { Character } from "@/lib/game/cairn/types";
import { useImmerLocalStorage } from "@/lib/hooks";

export default function MainMenu<TChar, TGame>() {
  const [characters, setCharacters] = useImmerLocalStorage<
    Record<string, Character>
  >("characters", {});
  return (
    <main className="p-4 max-w-6xl flex flex-col">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>characters</Title>
          <Button
            onClick={() =>
              setCharacters((repo) => {
                repo.toto = {
                  name: "test",
                  background: "",
                  dexterity: { current: 0, max: 0 },
                  strength: { current: 0, max: 0 },
                  willpower: { current: 0, max: 0 },
                  hp: { current: 0, max: 0 },
                };
              })
            }
          >
            new
          </Button>
        </div>
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>games</Title>
        </div>
      </div>
    </main>
  );
}
