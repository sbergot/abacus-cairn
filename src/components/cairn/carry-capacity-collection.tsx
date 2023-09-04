import { CairnCharacter, CarryCapacity } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import { clone, getSubLens } from "@/lib/utils";
import { Trash2Icon, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { DeleteAlert } from "../ui/delete-alert";
import { TitleWithIcons } from "../ui/title-with-icons";
import { Draft } from "immer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { carryCapacities } from "@/lib/game/cairn/other-data";
import { getEmptySlots } from "@/lib/game/cairn/character-generation";
import { WeakEmph } from "../ui/typography";
import { ButtonLike } from "../ui/button-like";
import { InventoryView } from "./inventory-view";

interface CarryCapacityCollectionProps {
  characterLens: ILens<CairnCharacter>;
}

export function CarryCapacityCollection({
  characterLens,
}: CarryCapacityCollectionProps) {
  const lens = getSubLens(characterLens, "carryCapacities");

  return (
    <div className="flex flex-col gap-2 items-start w-full mb-4">
      <NewCarryCapacityDialog
        onPick={(c) => {
          characterLens.setState((d) => {
            const count = d.carryCapacities.filter(
              (c1) => c1.name === c.name
            ).length;
            const newSlotType = `${c.name}-${count + 1}`;
            const newSlots = getEmptySlots(c.inventory.length, newSlotType);
            d.inventory.push(...newSlots);
            c.inventory = newSlots;
            const ccToAdd = clone(c);
            d.carryCapacities.push(ccToAdd as Draft<CarryCapacity>);
          });
        }}
      />
      {lens.state.map((carryCapacity) => {
        return (
          <Card key={carryCapacity.id} className="w-full">
            <CardHeader>
              <TitleWithIcons name={carryCapacity.name}>
                <DeleteAlert
                  icon={
                    <ButtonLike variant="ghost" size="icon-sm">
                      <Trash2Icon />
                    </ButtonLike>
                  }
                  onConfirm={() =>
                    characterLens.setState((d) => {
                      d.carryCapacities = d.carryCapacities.filter(
                        (n) => n.id !== carryCapacity.id
                      );
                      d.inventory = d.inventory.filter(
                        (s) =>
                          !carryCapacity.inventory.some((s1) => s.id === s1.id)
                      );
                    })
                  }
                >
                  This will permanently delete this carry capacity and all its
                  content.
                </DeleteAlert>
              </TitleWithIcons>
              <WeakEmph>{carryCapacity.description}</WeakEmph>
            </CardHeader>
            <CardContent>
              <InventoryView
                inventory={characterLens.state.inventory.filter(
                  (s) => carryCapacity.inventory.some((s1) => s.id === s1.id)
                )}
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
      <DialogTrigger asChild>
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
