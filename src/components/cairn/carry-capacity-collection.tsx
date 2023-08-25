import { CarryCapacity } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import { clone, getSubArrayLens, getSubLens } from "@/lib/utils";
import { Trash2Icon, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { DeleteAlert } from "../ui/delete-alert";
import { TitleWithIcons } from "./title-with-icons";
import { Draft } from "immer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { InventoryControl } from "./inventory-control";
import { carryCapacities } from "@/lib/game/cairn/data";
import { useRelativeLinker, useUrlParams } from "@/lib/hooks";
import { getEmptySlots } from "@/lib/game/cairn/character-generation";
import { WeakEmph } from "../ui/typography";

interface CarryCapacityCollectionProps {
  lens: ILens<CarryCapacity[]>;
}

export function CarryCapacityCollection({
  lens,
}: CarryCapacityCollectionProps) {
  const { characterId } = useUrlParams();
  const linker = useRelativeLinker();

  return (
    <div className="flex flex-col gap-2 items-start w-full mb-4">
      <NewCarryCapacityDialog
        onPick={(c) => {
          lens.setState((d) => {
            d.push(c as Draft<CarryCapacity>);
          });
        }}
      />
      {lens.state.map((carryCapacity, idx) => {
        const carryLens: ILens<CarryCapacity> = getSubArrayLens(lens, idx);
        return (
          <Card key={carryCapacity.id} className="w-full">
            <CardHeader>
              <TitleWithIcons name={carryCapacity.name}>
                <DeleteAlert
                  icon={
                    <Button variant="ghost" size="icon-sm">
                      <Trash2Icon />
                    </Button>
                  }
                  onConfirm={() =>
                    lens.setState((d) =>
                      d.filter((n) => n.id !== carryCapacity.id)
                    )
                  }
                >
                  This will permanently delete this carry capacity and all its
                  content.
                </DeleteAlert>
              </TitleWithIcons>
              <WeakEmph>{carryCapacity.description}</WeakEmph>
            </CardHeader>
            <CardContent>
              <InventoryControl
                slotsLens={getSubLens(carryLens, "inventory")}
                shopLink={(slotId) =>
                  linker(`shop?characterId=${characterId}&slotId=${slotId}`)
                }
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface NewCarryCapacityDialogProps {
  onPick(cc: CarryCapacity): void;
}

function NewCarryCapacityDialog({ onPick }: NewCarryCapacityDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <ShoppingCartIcon className="mr-2" /> New carry capacity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick carry capacity</DialogTitle>
        </DialogHeader>
        {carryCapacities.map((cc) => (
          <Button
            key={cc.id}
            onClick={() => {
              setOpen(false);
              const newCC = clone(cc);
              newCC.inventory = getEmptySlots(cc.inventory.length, cc.name);
              onPick(newCC);
            }}
          >
            {cc.name}
          </Button>
        ))}
      </DialogContent>
    </Dialog>
  );
}
