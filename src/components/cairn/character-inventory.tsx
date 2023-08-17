import {
  useCurrentCharacter,
  useLoggerContext,
} from "@/app/cairn/cairn-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  CheckCircle2Icon,
  CircleSlashIcon,
  PlusIcon,
  SwordIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRelativeLinker } from "@/lib/hooks";
import { DeleteAlert } from "../ui/delete-alert";
import { ShowSlotState } from "./show-slot-state";
import { Slot } from "@/lib/game/cairn/types";
import { roll } from "@/lib/random";

function getDamages(slot: Slot) {
  return slot.state.type === "gear" && slot.state.gear.damage !== undefined
    ? slot.state.gear.damage
    : 0;
}

export function CharacterInventory() {
  const { log } = useLoggerContext();
  const linker = useRelativeLinker();
  const lens = useCurrentCharacter();
  const slots = lens.state.inventory;

  function removeItem(slot: Slot) {
    lens.setState((d) => {
      const slotToEmpty = d.inventory.find((s) => s.id === slot.id)!;
      slotToEmpty.state = { type: "empty" };
      const otherSlot = d.inventory.find(
        (s) => s.state.type === "bulky" && s.state.slotId === slotToEmpty.id
      );
      if (otherSlot !== undefined) {
        otherSlot.state = { type: "empty" };
      }
    });
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">type</TableHead>
          <TableHead>gear</TableHead>
          <TableHead className="w-40">actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {slots.map((slot) => (
          <TableRow key={slot.id}>
            <TableCell className="p-1">{slot.type}</TableCell>
            <TableCell className="p-1">
              <ShowSlotState state={slot.state} />
            </TableCell>
            <TableCell className="p-1 flex gap-1">
              {slot.state.type === "empty" && (
                <>
                  <Button
                    size="icon-sm"
                    onClick={() =>
                      lens.setState((d) => {
                        const targetSlot = d.inventory.find(
                          (s) => s.id === slot.id
                        )!;
                        targetSlot.state = { type: "fatigue" };
                      })
                    }
                  >
                    <CircleSlashIcon />
                  </Button>
                  <Button size="icon-sm" asChild>
                    <Link href={linker(`shop/${slot.id}`)}>
                      <PlusIcon />
                    </Link>
                  </Button>
                </>
              )}
              {slot.state.type === "fatigue" && (
                <Button
                  size="icon-sm"
                  onClick={() =>
                    lens.setState((d) => {
                      const targetSlot = d.inventory.find(
                        (s) => s.id === slot.id
                      )!;
                      targetSlot.state = { type: "empty" };
                    })
                  }
                >
                  <CheckCircle2Icon />
                </Button>
              )}
              {slot.state.type === "gear" && (
                <DeleteAlert
                  onConfirm={() => removeItem(slot)}
                  icon={
                    <Button size="icon-sm">
                      <Trash2Icon />
                    </Button>
                  }
                >
                  This will permanently delete your item
                </DeleteAlert>
              )}
              {getDamages(slot) > 0 && (
                <Button
                  size="icon-sm"
                  onClick={() => {
                    log({
                      kind: "chat-custom",
                      type: "AttackRoll",
                      title: "Attack roll",
                      props: { result: roll(1, getDamages(slot)) },
                    });
                  }}
                >
                  <SwordIcon />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
