import { useLoggerContext } from "@/app/cairn-context";
import { Slot } from "@/lib/game/cairn/types";
import {
  clampGauge,
  dropItem,
  getDamageDiceNbr,
  getDamages,
} from "@/lib/game/cairn/utils";
import {
  CircleSlashIcon,
  PlusIcon,
  CheckCircle2Icon,
  Trash2Icon,
  SwordIcon,
  MinusIcon,
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
import { GearDescriptionDialog } from "./gear-description-dialog";
import { SwitchSlotDialog } from "./switch-slot-dialog";
import { maxRoll } from "@/lib/dice/dice";

interface Props {
  shopLink(slotId: string): string;
  slotsLens: ILens<Slot[]>;
}

export function InventoryControl({ shopLink, slotsLens }: Props) {
  const log = useLoggerContext();

  function removeItem(slot: Slot) {
    slotsLens.setState((d) => {
      dropItem(d, slot.id);
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
        {slotsLens.state.map((slot, idx) => (
          <TableRow key={slot.id} className="h-10">
            <TableCell className="p-1">{slot.type}</TableCell>
            <TableCell className="p-1">
              <ShowSlotState state={slot.state} />
            </TableCell>
            <TableCell className="p-1 flex gap-1">
              {slot.state.type === "empty" && (
                <>
                  {(slot.type === "hand" ||
                    slot.type === "body" ||
                    slot.type === "backpack") && (
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
                  )}
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
                <>
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
                  <SwitchSlotDialog slot={slot} />
                </>
              )}
              {getDamages(slot) > 0 && slot.type === "hand" && (
                <Button
                  size="icon-sm"
                  onClick={() => {
                    const dicePool = {
                      number: getDamageDiceNbr(slot),
                      sides: getDamages(slot),
                    };
                    log({
                      kind: "chat-custom",
                      type: "AttackRoll",
                      title: "Attack roll",
                      props: {
                        dice: dicePool,
                        result: maxRoll(dicePool),
                      },
                    });
                  }}
                >
                  <SwordIcon />
                </Button>
              )}
              {slot.state.type === "gear" && slot.state.gear.charges && (
                <>
                  <Button
                    size="icon-sm"
                    onClick={() => {
                      slotsLens.setState((d) => {
                        const slotStateToUpdate = d[idx].state;
                        if (
                          slotStateToUpdate.type === "gear" &&
                          slotStateToUpdate.gear.charges
                        ) {
                          const charges = slotStateToUpdate.gear.charges;
                          charges.current += 1;
                          clampGauge(charges);
                        }
                      });
                    }}
                  >
                    <PlusIcon />
                  </Button>
                  <Button
                    size="icon-sm"
                    onClick={() => {
                      slotsLens.setState((d) => {
                        const slotStateToUpdate = d[idx].state;
                        if (
                          slotStateToUpdate.type === "gear" &&
                          slotStateToUpdate.gear.charges
                        ) {
                          const charges = slotStateToUpdate.gear.charges;
                          charges.current -= 1;
                          clampGauge(charges);
                        }
                      });
                    }}
                  >
                    <MinusIcon />
                  </Button>
                </>
              )}
              {slot.state.type === "gear" && slot.state.gear.description && (
                <GearDescriptionDialog gear={slot.state.gear} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
