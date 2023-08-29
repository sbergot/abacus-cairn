import { useCurrentGame, useLoggerContext } from "@/app/cairn-context";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { hurt } from "@/lib/game/cairn/utils";
import { useState } from "react";
import { ButtonLike } from "../ui/button-like";

interface Props {
  damages: number;
}

export function GmDealDamageDialog({ damages }: Props) {
  const [open, setOpen] = useState(false);
  const gameLens = useCurrentGame();
  const log = useLoggerContext();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <ButtonLike>Deal damage</ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deal damage</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {gameLens.state.npcs.map((npc) => (
            <Button
              key={npc.id}
              onClick={() =>
                gameLens.setState((d) => {
                  const npcToUpdate = d.npcs.find((n) => n.id === npc.id)!;
                  hurt(npcToUpdate, damages, log, true);
                  setOpen(false);
                })
              }
            >
              {npc.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
