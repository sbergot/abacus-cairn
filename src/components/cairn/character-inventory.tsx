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
          <TableHead>actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {slots.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.type}</TableCell>
            <TableCell>
              <ShowGear gear={s.gear} />
            </TableCell>
            <TableCell>
              {s.gear === null && (
                <Button size="icon-sm" asChild>
                  <Link href={linker(`shop/${s.id}`)}>
                    <PlusIcon />
                  </Link>
                </Button>
              )}
              {s.gear !== null && (
                <DeleteAlert
                  onConfirm={() =>
                    lens.setState((d) => {
                      const slot = d.inventory.find(
                        (slot) => slot.id === s.id
                      )!;
                      slot.gear = null;
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

interface GearProps {
  gear: Gear | null;
}

function ShowGear({ gear }: GearProps) {
  if (gear === null) {
    return <WeakEmph>empty</WeakEmph>;
  }

  return gear.name;
}
