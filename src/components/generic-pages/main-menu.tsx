"use client";

import { Button } from "@/components/ui/button";
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
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { useGenericGameContext } from "@/lib/game-context";
import { useState } from "react";
import { ButtonLike } from "../ui/button-like";
import { GenericMenu } from "../ui/generic-menu";
import { OrSeparator } from "../ui/or-separator";
import { useRouter } from "next/navigation";
import { initGame } from "@/lib/game/cairn/utils";

export default function MainMenu() {
  const { characterRepo, gameRepo } = useGenericGameContext();

  return (
    <main className="p-4 max-w-6xl flex flex-col">
      <div className="flex flex-wrap gap-8">
        <GenericMenu
          title="character"
          lens={characterRepo}
          Entry={CharacterEntry}
          Create={() =>
            <Button asChild>
              <Link href={"create-character/stats"}>
                <UserPlusIcon className="mr-2" />
                new
              </Link>
            </Button>
          }
        />
        <GenericMenu
          title="game"
          lens={gameRepo}
          Entry={GameEntry}
          Create={() =>
            <NewGameModal
              onCreate={(name) => {
                gameRepo.setState((d) => {
                  const newGame = initGame(name);
                  d[newGame.id] = newGame;
                });
              }}
            />
          }
        />
      </div>
    </main>
  );
}

interface CharacterEntryProps {
  name: string;
  id: string;
  deleteObj(): void;
}

function CharacterEntry({ id, name, deleteObj }: CharacterEntryProps) {
  return (
    <div className="flex justify-between items-center p-2 border border-input bg-background max-w-sm">
      <div className="text-lg">{name}</div>
      <div className="flex gap-2">
        <SessionStartDialog characterId={id} />
        <DeleteAlert
          onConfirm={deleteObj}
          icon={
            <Button size="icon-sm" variant="ghost">
              <Trash2Icon />
            </Button>
          }
        >
          This action cannot be undone. This will permanently delete your
          character named <span className="font-bold">{name}</span>.
        </DeleteAlert>
      </div>
    </div>
  );
}

interface SessionStartProps {
  characterId: string;
}

function SessionStartDialog({ characterId }: SessionStartProps) {
  const router = useRouter();
  const [tableId, setTableId] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonLike size="icon-sm" variant="ghost">
          <PlayIcon />
        </ButtonLike>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start session</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href={`/session/solo?characterId=${characterId}`}>
              Start a solo session
            </Link>
          </Button>
          <OrSeparator />
          <div className="flex flex-col gap-2">
            <Input
              id="table-id"
              placeholder="table id"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            />
          </div>
          <Button
            disabled={!tableId}
            onClick={() =>
              router.push(
                `/session/table?tableId=${tableId}&characterId=${characterId}`
              )
            }
          >
            Join a table
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface GameEntryProps {
  name: string;
  id: string;
  deleteObj(): void;
}

function GameEntry({ id, name, deleteObj }: GameEntryProps) {
  return (
    <div className="flex justify-between items-center p-2 border border-input bg-background max-w-sm">
      <div className="text-lg">{name}</div>
      <div className="flex gap-2">
        <Button size="icon-sm" variant="ghost" asChild>
          <Link href={`/session/host?gameId=${id}`}>
            <PlayIcon />
          </Link>
        </Button>
        <DeleteAlert
          onConfirm={deleteObj}
          icon={
            <Button size="icon-sm" variant="ghost">
              <Trash2Icon />
            </Button>
          }
        >
          This action cannot be undone. This will permanently delete your game
          titled <span className="font-bold">{name}</span>.
        </DeleteAlert>
      </div>
    </div>
  );
}

interface NewGameModalProps {
  onCreate(name: string): void;
}

export function NewGameModal({ onCreate }: NewGameModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonLike>
          <FilePlus2Icon className="mr-2" /> new
        </ButtonLike>
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
