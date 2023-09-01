"use client"

import { PlayIcon, Trash2Icon, UserPlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { GenericMenu } from "../ui/generic-menu";
import Link from "next/link";
import { useGenericGameContext } from "@/lib/game-context";
import { DeleteAlert } from "../ui/delete-alert";
import { ButtonLike } from "../ui/button-like";
import { useUrlParams } from "@/lib/hooks";

export function Invitation() {
  const { characterRepo } = useGenericGameContext();

  return (
    <GenericMenu
      title="character"
      lens={characterRepo}
      Entry={CharacterEntry}
      Create={() => (
        <Button asChild>
          <Link href={"create-character/stats"}>
            <UserPlusIcon className="mr-2" />
            new
          </Link>
        </Button>
      )}
    />
  );
}

interface CharacterEntryProps {
  name: string;
  id: string;
  deleteObj(): void;
}

function CharacterEntry({ id, name, deleteObj }: CharacterEntryProps) {
  const { tableId } = useUrlParams();
  return (
    <div className="flex justify-between items-center p-2 border border-input bg-background max-w-sm">
      <div className="text-lg">{name}</div>
      <div className="flex gap-2">
        <ButtonLike size="icon-sm" variant="ghost">
          <Link href={`/session/table?tableId=${tableId}&characterId=${id}`}>
            <PlayIcon />
          </Link>
        </ButtonLike>
        <DeleteAlert
          onConfirm={deleteObj}
          icon={
            <Button size="icon-sm" variant="ghost" asChild>
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
