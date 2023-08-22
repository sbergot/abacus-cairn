import { ShowSlotState } from "@/components/cairn/show-slot-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCharacterCreationContext } from "./character-creation-context";

export function CharacterInventoryView() {
  const { lens } = useCharacterCreationContext();
  const { state: character } = lens;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">type</TableHead>
          <TableHead>gear</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {character.inventory.map((slot) => (
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
