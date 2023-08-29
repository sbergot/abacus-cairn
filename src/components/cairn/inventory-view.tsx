import { ShowSlotState } from "@/components/cairn/show-slot-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slot } from "@/lib/game/cairn/types";

interface Props {
  inventory: Slot[];
}

export function InventoryView({ inventory }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">type</TableHead>
          <TableHead>gear</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((slot) => (
          <TableRow key={slot.id}>
            <TableCell className="p-1">{slot.type}</TableCell>
            <TableCell className="p-1">
              <ShowSlotState state={slot.state} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
