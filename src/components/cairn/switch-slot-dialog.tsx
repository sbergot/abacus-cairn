import { Slot } from "@/lib/game/cairn/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CheckIcon, RefreshCwIcon } from "lucide-react";
import { ButtonLike } from "../ui/button-like";
import { useState } from "react";
import { useCurrentCharacter, useLoggerContext } from "@/app/cairn-context";
import {
  dropItem,
  findFreeSiblingSlot,
  grabItem,
} from "@/lib/game/cairn/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ShowSlotState } from "./show-slot-state";
import { Button } from "../ui/button";

interface Props {
  slot: Slot;
}

export function SwitchSlotDialog({ slot }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonLike size="icon-sm">
          <RefreshCwIcon />
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <SwitchSlot slot={slot} done={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

interface SwitchSlotProps {
  slot: Slot;
  done(): void;
}

function SwitchSlot({ slot, done }: SwitchSlotProps) {
  const characterLens = useCurrentCharacter();
  const log = useLoggerContext();
  const [firstTarget, setFirstTarget] = useState<string | null>(null);
  if (slot.state.type !== "gear") {
    return <div>Slot is not a gear</div>;
  }
  let switchTargets = findValidSwitchTargets(
    slot,
    characterLens.state.inventory
  );

  if (firstTarget !== null) {
    const firstTargetSlot = characterLens.state.inventory.find(
      (s) => s.id === firstTarget
    )!;
    switchTargets = switchTargets.filter(
      (s) =>
        s.type === firstTargetSlot.type &&
        (s.state.type !== "gear" || !s.state.gear.bulky) &&
        s.id !== firstTarget
    );
  }

  function performSwitch(targetSlotId: string) {
    {
      // If we are switching a bulky item, then if
      // we have selected a non bulky item without free
      // sibling, we have to pick another non bulky item
      // in the same slot category to be able to perform
      // the switch.
      // The first target is stored in a local react state
      const targetSlot = characterLens.state.inventory.find(
        (s) => s.id === targetSlotId
      )!;
      const targetHasNoFreeSibling =
        findFreeSiblingSlot(characterLens.state.inventory, targetSlot) ===
        undefined;
      const requiresSecondPick =
        isBulkyGear(slot) && !isBulkyGear(targetSlot) && targetHasNoFreeSibling;
      if (requiresSecondPick && firstTarget === null) {
        setFirstTarget(targetSlotId);
        return;
      }
    }
    characterLens.setState((d) => {
      // first locate and drop items to switch
      const targetSlot = d.inventory.find((s) => s.id === targetSlotId)!;
      const targetGear =
        targetSlot.state.type === "gear" ? targetSlot.state.gear : null;
      if (targetGear !== null) {
        dropItem(d.inventory, targetSlotId);
      }

      const firstTargetSlot =
        firstTarget === null
          ? null
          : d.inventory.find((s) => s.id === firstTarget)!;
      const firstTargetGear =
        firstTargetSlot !== null && firstTargetSlot.state.type === "gear"
          ? firstTargetSlot.state.gear
          : null;
      if (firstTargetGear !== null) {
        dropItem(d.inventory, firstTarget!);
      }
      // if multiple target must be picked,
      // the first one will switch with the "secondary"
      // bulky slot
      const currentBulkySlot = d.inventory.find(
        (s) => s.state.type === "bulky" && s.state.slotId === slot.id
      );

      const gearToSwitch = slot.state.type === "gear" ? slot.state.gear : null;
      if (gearToSwitch === null) {
        throw new Error("impossible");
      }
      dropItem(d.inventory, slot.id);

      // regrab the items
      grabItem(d, gearToSwitch, targetSlotId, log);
      if (targetGear !== null) {
        grabItem(d, targetGear, slot.id, log);
      }
      if (firstTargetGear !== null) {
        grabItem(d, firstTargetGear, currentBulkySlot!.id, log);
      }
    });
    done();
  }

  if (switchTargets.length === 0) {
    return <div>No valid slot available</div>;
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {firstTarget === null
            ? "Pick a slot to switch"
            : "Pick a second slot"}
        </DialogTitle>
      </DialogHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">type</TableHead>
            <TableHead>gear</TableHead>
            <TableHead className="w-40">actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {switchTargets.map((st) => (
            <TableRow key={st.id} className="h-10">
              <TableCell className="p-1">{st.type}</TableCell>
              <TableCell className="p-1">
                <ShowSlotState state={st.state} />
              </TableCell>
              <TableCell className="p-1">
                <Button size="icon-sm" onClick={() => performSwitch(st.id)}>
                  <CheckIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

function findValidSwitchTargets(slotToSwitch: Slot, inventory: Slot[]): Slot[] {
  if (slotToSwitch.state.type !== "gear") {
    throw new Error("slot is not a gear");
  }
  const gear = slotToSwitch.state.gear;
  const bulky = gear.bulky;
  const sibling = findFreeSiblingSlot(inventory, slotToSwitch);
  const possibleTargets = inventory.filter(
    (s) =>
      s.type !== slotToSwitch.type &&
      (s.state.type === "empty" || s.state.type === "gear")
  );

  if (!bulky) {
    if (sibling !== undefined) {
      return possibleTargets;
    } else {
      return possibleTargets.filter((s) => !isBulkyGear(s));
    }
  } else {
    return possibleTargets;
  }
}

function isBulkyGear(slot: Slot): boolean {
  if (slot.state.type !== "gear") {
    return false;
  }
  return !!slot.state.gear.bulky;
}
