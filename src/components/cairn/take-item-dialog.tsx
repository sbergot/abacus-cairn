import { countBy } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useCurrentCharacter } from "@/app/cairn-context";
import { Gear } from "@/lib/game/cairn/types";
import { Button } from "../ui/button";

interface Props {
  item: Gear;
}

export function TakeItemDialog({ item }: Props) {
  const characterLens = useCurrentCharacter();
  const emptySlots = characterLens.state.inventory.filter(
    (s) => s.state.type === "empty"
  );
  const emptySlotsCount = countBy(emptySlots, (s) => s.type);
  const requiredSlots = item.bulky ? 2 : 1;
  const allowedSlotTypes = Object.keys(emptySlotsCount).filter(
    (st) => emptySlotsCount[st] >= requiredSlots
  );
  return (
    <Dialog>
      <DialogTrigger>Take</DialogTrigger>
      <DialogContent>
        {allowedSlotTypes.length === 0 ? (
          "No slot available for this item"
        ) : (
          <div>
            {allowedSlotTypes.map((st) => (
              <Button key={st}>{st}</Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
