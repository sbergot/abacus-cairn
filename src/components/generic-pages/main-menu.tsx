"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { BaseCharacter } from "@/lib/game/types";
import { useRelativeLinker } from "@/lib/hooks";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { PlayIcon, UploadIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { OrSeparator } from "@/components/ui/or-separator";
import { FileImport } from "../ui/file-import";
import { useGenericGameContext } from "@/lib/gameContext";
import { download } from "@/lib/utils";

interface Props {}

export default function MainMenu<
  TChar extends BaseCharacter,
  TGame
>({}: Props) {
  const {
    characterRepo: { state: characters, setState: setCharacters },
    gameName,
  } = useGenericGameContext();
  const linker = useRelativeLinker();

  return (
    <main className="p-4 max-w-6xl flex flex-col">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <Title>characters</Title>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={linker("create-character")}>
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
                sessionLink={linker(`session/${c.id}`)}
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
        <PlayModal sessionLink={sessionLink} />
        <DeleteAlert onConfirm={deleteCharacter}>
          This action cannot be undone. This will permanently delete your
          character named <span className="font-bold">{name}</span>.
        </DeleteAlert>
      </div>
    </div>
  );
}

interface PlayModalProps {
  sessionLink: string;
}

export function PlayModal({ sessionLink }: PlayModalProps) {
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
