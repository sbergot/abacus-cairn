"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { MessagePanel } from "@/components/generic-pages/message-panel";
import { CairnMessage } from "@/lib/game/cairn/types";
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
  const currentSlot = character.inventory.find((s) => s.id === slotId)!
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>gear</TableHead>
          <TableHead>actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {weapons.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.name}</TableCell>
            <TableCell>
              {currentSlot.gear === null && <Button
                onClick={() => {
                  setCharacter((d) => {
                    const slot = d.inventory.find((s) => s.id === slotId)!;
                    slot.gear = { ...s };
                  });
                  router.push(linker("../.."));
                }}
                size="icon-sm"
              >
                <PlusIcon />
              </Button>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
