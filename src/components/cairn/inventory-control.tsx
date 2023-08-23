import { useLoggerContext } from "@/app/cairn-context";
import { Slot } from "@/lib/game/cairn/types";
import { getDamages } from "@/lib/game/cairn/utils";
import { roll } from "@/lib/random";
import {
  CircleSlashIcon,
  PlusIcon,
  CheckCircle2Icon,
  Trash2Icon,
  SwordIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { DeleteAlert } from "../ui/delete-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ShowSlotState } from "./show-slot-state";
import { ILens } from "@/lib/types";
import Link from "next/link";

interface Props {
  shopLink(slotId: string): string;
  slotsLens: ILens<Slot[]>;
}

export function InventoryControl({ shopLink, slotsLens }: Props) {
  const log = useLoggerContext();

  function removeItem(slot: Slot) {
    slotsLens.setState((d) => {
      const slotToEmpty = d.find((s) => s.id === slot.id)!;
      slotToEmpty.state = { type: "empty" };
      const otherSlot = d.find(
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
        {slotsLens.state.map((slot) => (
          <TableRow key={slot.id} className="h-10">
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
                      slotsLens.setState((d) => {
                        const targetSlot = d.find((s) => s.id === slot.id)!;
                        targetSlot.state = { type: "fatigue" };
                      })
                    }
                  >
                    <CircleSlashIcon />
                  </Button>
                  <Button size="icon-sm" asChild>
                    <Link href={shopLink(slot.id)}>
                      <PlusIcon />
                    </Link>
                  </Button>
                </>
              )}
              {slot.state.type === "fatigue" && (
                <Button
                  size="icon-sm"
                  onClick={() =>
                    slotsLens.setState((d) => {
                      const targetSlot = d.find((s) => s.id === slot.id)!;
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
              {getDamages(slot) > 0 && slot.type === "hand" && (
                <Button
                  size="icon-sm"
                  onClick={() => {
                    const damages = getDamages(slot);
                    log({
                      kind: "chat-custom",
                      type: "AttackRoll",
                      title: "Attack roll",
                      props: { dice: damages, result: roll(1, damages) },
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
