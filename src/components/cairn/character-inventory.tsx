import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRelativeLinker } from "@/lib/hooks";
import { DeleteAlert } from "../ui/delete-alert";
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
        {slots.map((slot) => (
          <TableRow key={slot.id}>
            <TableCell className="p-1">{slot.type}</TableCell>
            <TableCell className="p-1">
              <ShowSlotState state={slot.state} />
            </TableCell>
            <TableCell className="p-1">
              {slot.state.type === "empty" && (
                <Button size="icon-sm" asChild>
                  <Link href={linker(`shop/${slot.id}`)}>
                    <PlusIcon />
                  </Link>
                </Button>
              )}
              {(slot.state.type === "gear" ||
                slot.state.type === "fatigue") && (
                <DeleteAlert
                  onConfirm={() =>
                    lens.setState((d) => {
                      const slotToEmpty = d.inventory.find(
                        (s) => s.id === slot.id
                      )!;
                      slotToEmpty.state = { type: "empty" };
                      const otherSlot = d.inventory.find(
                        (s) =>
                          s.state.type === "bulky" &&
                          s.state.slotId === slotToEmpty.id
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
