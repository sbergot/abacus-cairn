"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { MessagePanel } from "@/components/generic-pages/message-panel";
import { CairnMessage, Gear } from "@/lib/game/cairn/types";
import {
  useCurrentCharacter,
  usePlayerConnectionContext,
} from "@/app/cairn/cairn-context";
import { ShowCustomMessage } from "@/components/cairn/show-custom-message";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { weapons } from "@/lib/game/cairn/data";
import { useParams, useRouter } from "next/navigation";
import { useRelativeLinker } from "@/lib/hooks";
import { ShowGear } from "@/components/cairn/show-gear";
import { clone } from "@/lib/utils";

export default function Session() {
  const characterLens = useCurrentCharacter();
  const { messages } = usePlayerConnectionContext();
  return (
    <TwoColumns
      leftPart={<Shop />}
      rightPart={
        <MessagePanel<CairnMessage>
          context={{ contextType: "player", authorId: characterLens.state.id }}
          messages={messages}
          ShowCustomMessage={ShowCustomMessage}
        />
      }
    />
  );
}

function Shop() {
  const { state: character, setState: setCharacter } = useCurrentCharacter();
  const { slotId } = useParams();
  const router = useRouter();
  const linker = useRelativeLinker();
  const currentSlot = character.inventory.find((s) => s.id === slotId)!;
  const siblingFreeSlot = character.inventory.find(
    (s) =>
      s.type === currentSlot.type && s.state.type === "empty" && s.id !== slotId
  );

  function canGrab(gear: Gear): boolean {
    if (currentSlot.state.type !== "empty") {
      return false;
    }

    if (
      siblingFreeSlot === null &&
      gear.tags.find((t) => t.type === "bulky") !== null
    ) {
      return false;
    }

    return true;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>gear</TableHead>
          <TableHead className="w-40">actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {weapons.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="p-1">
              <ShowGear gear={s} />
            </TableCell>
            <TableCell className="p-1">
              {canGrab(s) && (
                <Button
                  onClick={() => {
                    setCharacter((d) => {
                      const slot = d.inventory.find((s) => s.id === slotId)!;
                      slot.state = { type: "gear", gear: clone(s) };
                      if (s.tags.find((t) => t.type === "bulky") !== null) {
                        const otherSlot = d.inventory.find(
                          (s) => s.id === siblingFreeSlot?.id
                        )!;
                        otherSlot.state = {
                          type: "bulky",
                          slotId,
                          name: s.name,
                        };
                      }
                    });
                    router.push(linker("../.."));
                  }}
                  size="icon-sm"
                >
                  <PlusIcon />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
