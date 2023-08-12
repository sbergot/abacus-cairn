"use client";

import { Button } from "@/components/ui/button";
import { BaseCharacter, BaseGame } from "@/lib/game/types";
import { useRelativeLinker } from "@/lib/hooks";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  FilePlus2Icon,
  PlayIcon,
  UploadIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { OrSeparator } from "@/components/ui/or-separator";
import { FileImport } from "../ui/file-import";
import { useGenericGameContext } from "@/lib/gameContext";
import { download } from "@/lib/utils";
import { Title } from "../ui/typography";
import { UknownGameMessage } from "@/lib/network/types";
import { useState } from "react";
import { initGame } from "@/lib/game/cairn/utils";

interface MainMenuProps {}

export default function MainMenu<
  TChar extends BaseCharacter,
  TGame
>({}: MainMenuProps) {
  const {
    characterRepo: { state: characters, setState: setCharacters },
    gameRepo: { state: games, setState: setGames },
    gameName,
  } = useGenericGameContext();
  const linker = useRelativeLinker();

  return (
    <main className="p-4 max-w-6xl flex flex-col">
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>characters</Title>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={linker("create-character/stats")}>
                <UserPlusIcon className="mr-2" />
                new
              </Link>
            </Button>
            <FileImport
              variant="secondary"
              label="import"
              onUpLoad={(body) => {
                setCharacters((d) => {
                  const newData = JSON.parse(body) as Record<
                    string,
                    BaseCharacter
                  >;
                  Object.values(newData).forEach((c) => (d[c.id] = c));
                });
              }}
            />
            <Button
              variant="secondary"
              onClick={() => download(`${gameName}-characters`)}
            >
              <UploadIcon className="mr-2" />
              export
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {Object.values(characters).map((c) => (
              <CharacterEntry
                key={c.id}
                name={c.name}
                sessionLink={linker(`session/solo/${c.id}`)}
                deleteCharacter={() =>
                  setCharacters((repo) => {
                    delete repo[c.id];
                  })
                }
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>games</Title>
          <div className="flex gap-2">
            <NewGameModal
              onCreate={(name) => {
                setGames((d) => {
                  const newGame = initGame(name);
                  d[newGame.id] = newGame;
                });
              }}
            />
            <FileImport
              variant="secondary"
              label="import"
              onUpLoad={(body) => {
                setGames((d) => {
                  const newData = JSON.parse(body) as Record<
                    string,
                    BaseGame<UknownGameMessage>
                  >;
                  Object.values(newData).forEach((c) => (d[c.id] = c));
                });
              }}
            />
            <Button
              variant="secondary"
              onClick={() => download(`${gameName}-games`)}
            >
              <UploadIcon className="mr-2" />
              export
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {Object.values(games).map((c) => (
              <GameEntry
                key={c.id}
                name={c.title}
                sessionLink={linker(`session/shared/${c.id}/game-master`)}
                deleteGame={() =>
                  setGames((repo) => {
                    delete repo[c.id];
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

interface CharacterEntryProps {
  name: string;
  sessionLink: string;
  deleteCharacter(): void;
}

function CharacterEntry({
  sessionLink,
  name,
  deleteCharacter,
}: CharacterEntryProps) {
  return (
    <div className="flex justify-between items-center p-2 border border-input bg-background">
      <div className="text-lg">{name}</div>
      <div className="flex gap-2">
        <SessionStartModal sessionLink={sessionLink} />
        <DeleteAlert onConfirm={deleteCharacter}>
          This action cannot be undone. This will permanently delete your
          character named <span className="font-bold">{name}</span>.
        </DeleteAlert>
      </div>
    </div>
  );
}

interface GameEntryProps {
  name: string;
  sessionLink: string;
  deleteGame(): void;
}

function GameEntry({ sessionLink, name, deleteGame }: GameEntryProps) {
  return (
    <div className="flex justify-between items-center p-2 border border-input bg-background">
      <div className="text-lg">{name}</div>
      <div className="flex gap-2">
        <SessionStartModal sessionLink={sessionLink} />
        <DeleteAlert onConfirm={deleteGame}>
          This action cannot be undone. This will permanently delete your game
          titled <span className="font-bold">{name}</span>.
        </DeleteAlert>
      </div>
    </div>
  );
}

interface SessionStartProps {
  characterId: string;
}

export function SessionStartModal({ sessionLink }: SessionStartProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="ghost">
          <PlayIcon size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start session</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href={sessionLink}>Start a solo session</Link>
          </Button>
          <OrSeparator />
          <div className="flex flex-col gap-2">
            <Input id="table-id" placeholder="table id" />
          </div>
          <Button>Join a table</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface NewGameModalProps {
  onCreate(name: string): void;
}

export function NewGameModal({ onCreate }: NewGameModalProps) {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FilePlus2Icon size={20} className="mr-2" /> new
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New game</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreate(name);
            setOpen(false);
          }}
        >
          <div className="flex flex-col gap-2">
            <Input
              id="game-name"
              placeholder="game name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
