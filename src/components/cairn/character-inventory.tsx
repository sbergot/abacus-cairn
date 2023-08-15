import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Gear } from "@/lib/game/cairn/types";
import { WeakEmph } from "../ui/typography";
import { Button } from "../ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRelativeLinker } from "@/lib/hooks";
import { DeleteAlert } from "../ui/delete-alert";
import { ShowGear } from "./show-gear";
import { ShowSlotState } from "./show-slot-state";

export function CharacterInventory() {
  const linker = useRelativeLinker();
  const lens = useCurrentCharacter();
  const slots = lens.state.inventory;
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
        {slots.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="p-1">{s.type}</TableCell>
            <TableCell className="p-1">
              <ShowSlotState state={s.state} />
            </TableCell>
            <TableCell className="p-1">
              {s.state.type === "empty" && (
                <Button size="icon-sm" asChild>
                  <Link href={linker(`shop/${s.id}`)}>
                    <PlusIcon />
                  </Link>
                </Button>
              )}
              {(s.state.type === "gear" || s.state.type === "fatigue") && (
                <DeleteAlert
                  onConfirm={() =>
                    lens.setState((d) => {
                      const slot = d.inventory.find(
                        (slot) => slot.id === s.id
                      )!;
                      slot.state = { type: "empty" };
                      const otherSlot = d.inventory.find(
                        (s) =>
                          s.state.type === "bulky" && s.state.slotId === s.id
                      );
                      if (otherSlot !== undefined) {
                        otherSlot.state = { type: "empty" };
                      }
                    })
                  }
                  icon={
                    <Button size="icon-sm">
                      <Trash2Icon />
                    </Button>
                  }
                >
                  This will permanently delete your item
                </DeleteAlert>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
