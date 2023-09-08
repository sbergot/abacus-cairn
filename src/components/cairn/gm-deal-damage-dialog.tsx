import { useCurrentGame, useLoggerContext } from "@/app/cairn-context";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { getAllNpcs, hurt } from "@/lib/game/cairn/utils";
import { useEffect, useState } from "react";
import { ButtonLike } from "../ui/button-like";
import { findById } from "@/lib/utils";
import { Undo2Icon } from "lucide-react";
import { SearchInput } from "../ui/search-input";
import { useLens } from "@/lib/hooks";
import { WeakEmph } from "../ui/typography";

interface Props {
  damages: number;
}

export function GmDealDamageDialog({ damages }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const gameLens = useCurrentGame();
  const log = useLoggerContext();
  const searchLens = useLens("");

  useEffect(() => {
    setSelectedCategory(null);
    searchLens.setState(() => "");
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonLike>Deal damage</ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedCategory === null ? "Select category" : "Deal damage"}
          </DialogTitle>
        </DialogHeader>
        {selectedCategory === null && (
          <div className="flex flex-wrap gap-2">
            {gameLens.state.content
              .filter((c) => c.type === "character")
              .map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
          </div>
        )}
        {selectedCategory !== null && (
          <>
            <div className="flex gap-2 items-center">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSelectedCategory(null)}
              >
                <Undo2Icon />
              </Button>
              <SearchInput lens={searchLens} />
            </div>
            {findById(gameLens.state.content, selectedCategory).entries.length >
              20 && (
              <WeakEmph>Results limited to the first 20 entries</WeakEmph>
            )}
            <div className="flex flex-wrap gap-2">
              {findById(gameLens.state.content, selectedCategory)
                .entries.filter((i) =>
                  i.name.toLowerCase().includes(searchLens.state.toLowerCase())
                )
                .slice(0, 20)
                .map((npc) => (
                  <Button
                    key={npc.id}
                    onClick={() =>
                      gameLens.setState((d) => {
                        const npcToUpdate = getAllNpcs(d).find(
                          (n) => n.id === npc.id
                        )!;
                        hurt(npcToUpdate, damages, log, true);
                        setOpen(false);
                      })
                    }
                  >
                    {npc.name}
                  </Button>
                ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
