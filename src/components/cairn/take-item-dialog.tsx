import { countBy } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useCurrentCharacter, useLoggerContext } from "@/app/cairn-context";
import { Gear } from "@/lib/game/cairn/types";
import { Button } from "../ui/button";
import { grabItem } from "@/lib/game/cairn/utils";
import { useState } from "react";
import { ButtonLike } from "../ui/button-like";

interface Props {
  item: Gear;
}

export function TakeItemDialog({ item }: Props) {
  const [open, setOpen] = useState(false);
  const characterLens = useCurrentCharacter();
  const log = useLoggerContext();
  const emptySlots = characterLens.state.inventory.filter(
    (s) => s.state.type === "empty"
  );
  const emptySlotsCount = countBy(emptySlots, (s) => s.type);
  const requiredSlots = item.bulky ? 2 : 1;
  const allowedSlotTypes = Object.keys(emptySlotsCount).filter(
    (st) => emptySlotsCount[st] >= requiredSlots
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonLike>Take</ButtonLike>
      </DialogTrigger>
      <DialogContent>
        {allowedSlotTypes.length === 0 ? (
          "No slot available for this item"
        ) : (
          <div>
            <div>Take the item in:</div>
            <div>
              {allowedSlotTypes.map((st) => (
                <Button
                  onClick={() => {
                    characterLens.setState((c) => {
                      grabItem(
                        c,
                        item,
                        c.inventory.find(
                          (s) => s.type === st && s.state.type === "empty"
                        )!.id,
                        log
                      );
                    });
                    setOpen(false);
                  }}
                  key={st}
                >
                  {st}
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
