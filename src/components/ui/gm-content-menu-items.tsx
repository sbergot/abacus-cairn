import {
  EyeIcon,
  EyeOffIcon,
  XCircle,
  CheckCircle2Icon,
  ClipboardPasteIcon,
} from "lucide-react";
import { Button } from "./button";
import { MenuEntry } from "./menu-entry";
import { ILens } from "@/lib/types";
import { CategoryType, GmContent } from "@/lib/game/types";
import { ButtonLike } from "./button-like";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { useCurrentGame } from "@/app/cairn-context";
import { clone, getSubArrayLensById, getSubLens } from "@/lib/utils";
import { useState } from "react";

interface Props<T> {
  lens: ILens<T>;
  categoryType: CategoryType;
}

export function GmContentMenuItems<T extends GmContent>({
  lens,
  categoryType,
}: Props<T>) {
  return (
    <>
      <MenuEntry>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full"
          size="icon-sm"
          onClick={() =>
            lens.setState((d) => {
              d.visibleToAll = !d.visibleToAll;
            })
          }
        >
          {lens.state.visibleToAll ? <EyeIcon /> : <EyeOffIcon />}
          <div className="flex-grow text-left">
            {lens.state.visibleToAll
              ? "Make invisible to players"
              : "Make visible to players"}
          </div>
        </Button>
      </MenuEntry>
      <MenuEntry>
        <Button
          variant="ghost"
          size="icon-sm"
          className="flex items-center gap-2 w-full"
          onClick={() =>
            lens.setState((d) => {
              d.excludedFromRandomPick = !d.excludedFromRandomPick;
            })
          }
        >
          {lens.state.excludedFromRandomPick ? (
            <XCircle />
          ) : (
            <CheckCircle2Icon />
          )}
          <div className="flex-grow text-left">
            {lens.state.excludedFromRandomPick
              ? "Include in random pick"
              : "Exclude from random pick"}
          </div>
        </Button>
      </MenuEntry>
      <MenuEntry>
        <EntryCopyDialog categoryType={categoryType} entry={lens.state} />
      </MenuEntry>
    </>
  );
}

interface EntryCopyDialogProps {
  categoryType: CategoryType;
  entry: GmContent;
}

function EntryCopyDialog({ categoryType, entry }: EntryCopyDialogProps) {
  const gameLens = useCurrentGame();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <ButtonLike
          variant="ghost"
          size="icon-sm"
          className="flex items-center gap-2 w-full"
        >
          <ClipboardPasteIcon />
          <div className="flex-grow text-left">Copy to other category</div>
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        {gameLens.state.content
          .filter((cat) => cat.type === categoryType)
          .map((category) => (
            <Button
              key={category.id}
              onClick={() => {
                const categoriesLens = getSubLens(gameLens, "content");
                const categoryLens = getSubArrayLensById(
                  categoriesLens,
                  category.id
                );
                categoryLens.setState((d) => {
                  d.entries.push(clone(entry) as any);
                });
                setOpen(false);
              }}
            >
              {category.name}
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}
