import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Gear } from "@/lib/game/cairn/types";
import { WeakEmph } from "../ui/typography";

export function CharacterInventory() {
  const lens = useCurrentCharacter();
  const slots = lens.state.inventory;
  return <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">type</TableHead>
      <TableHead>gear</TableHead>
      <TableHead>actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {slots.map((s) => (
      <TableRow key={s.id}>
        <TableCell>{s.type}</TableCell>
        <TableCell><ShowGear gear={s.gear} /></TableCell>
       </TableRow>
    ))}
  </TableBody>
</Table>
}

interface GearProps {
  gear: Gear | null;
}

function ShowGear({ gear }: GearProps) {
  if (gear === null) {
    return <WeakEmph>empty</WeakEmph>
  }

  return gear.name;
}