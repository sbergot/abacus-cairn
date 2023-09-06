import { Trash2Icon } from "lucide-react";
import { ButtonLike } from "./button-like";
import { DeleteAlert } from "./delete-alert";
import { ILens } from "@/lib/types";
import { WithId } from "@/lib/game/types";
import { StrongEmph } from "./typography";

interface Props<T> {
  collectionLens: ILens<T[]>;
  entry: WithId & { name: string };
  type: string;
}

export function DeleteMenuItem<T extends WithId>({ collectionLens, entry, type }: Props<T>) {
  return (
    <DeleteAlert
      icon={
        <ButtonLike variant="ghost" size="xs" className="flex gap-2 w-full">
          <Trash2Icon />
          <div className="flex-grow text-left">Delete</div>
        </ButtonLike>
      }
      onConfirm={() =>
        collectionLens.setState((d) => d.filter((e) => e.id !== entry.id))
      }
    >
      This will permanently delete this {type} named{" "}
      <StrongEmph>{entry.name}</StrongEmph>
    </DeleteAlert>
  );
}
