"use client";

import { CairnCharacter, Gear, Slot } from "@/lib/game/cairn/types";
import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PackagePlusIcon, PlusIcon, SearchIcon } from "lucide-react";
import {
  allItems,
  armors,
  expeditionGear,
  otherItems,
  tools,
  trinkets,
  weapons,
} from "@/lib/game/cairn/data";
import { useRouter } from "next/navigation";
import { useRelativeLinker, useUrlParams } from "@/lib/hooks";
import { ShowGear } from "@/components/cairn/show-gear";
import { clone, uuidv4 } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useImmer } from "use-immer";
import TextField from "@/components/ui/textfield";
import { ILens } from "@/lib/types";
import CheckboxField from "@/components/ui/checkboxfield";
import NumberField from "@/components/ui/numberfield";
import { DiceSelect } from "@/components/cairn/dice-select";
import { ArmorSelect } from "@/components/cairn/armor-select";

function findFreeSiblingSlot(inventory: Slot[], currentSlot: Slot) {
  const siblingFreeSlot = inventory.find(
    (s) =>
      s.type === currentSlot.type &&
      s.state.type === "empty" &&
      s.id !== currentSlot.id
  );
  return siblingFreeSlot;
}

export function Shop() {
  return (
    <>
      <NewItemDialog />
      <Tabs className="mt-2" defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="weapons">Weapons</TabsTrigger>
          <TabsTrigger value="armors">Armors</TabsTrigger>
          <TabsTrigger value="expeditionGear">Expedition Gear</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="trinkets">Trinkets</TabsTrigger>
          <TabsTrigger value="others">Others</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ShopTable items={allItems} />
        </TabsContent>
        <TabsContent value="weapons">
          <ShopTable items={weapons} />
        </TabsContent>
        <TabsContent value="armors">
          <ShopTable items={armors} />
        </TabsContent>
        <TabsContent value="expeditionGear">
          <ShopTable items={expeditionGear} />
        </TabsContent>
        <TabsContent value="tools">
          <ShopTable items={tools} />
        </TabsContent>
        <TabsContent value="trinkets">
          <ShopTable items={trinkets} />
        </TabsContent>
        <TabsContent value="others">
          <ShopTable items={otherItems} />
        </TabsContent>
      </Tabs>
    </>
  );
}

function canGrab(
  character: CairnCharacter,
  gear: Gear,
  slotId: string
): boolean {
  const currentSlot = character.inventory.find((s) => s.id === slotId)!;
  const siblingFreeSlot = findFreeSiblingSlot(character.inventory, currentSlot);

  if (currentSlot.state.type !== "empty") {
    return false;
  }

  if (!siblingFreeSlot && gear.bulky) {
    return false;
  }

  return true;
}

function grab(character: CairnCharacter, gear: Gear, slotId: string) {
  const currentSlot = character.inventory.find((s) => s.id === slotId)!;
  const siblingFreeSlot = findFreeSiblingSlot(character.inventory, currentSlot);
  const { inventory } = character;

  const slot = inventory.find((s) => s.id === slotId)!;
  slot.state = { type: "gear", gear: clone(gear) };
  if (gear.bulky) {
    const otherSlot = inventory.find((s) => s.id === siblingFreeSlot?.id)!;
    otherSlot.state = {
      type: "bulky",
      slotId,
      name: gear.name,
    };
  }
}

function removeKey(obj: Record<string, string>, keys: string[]) {
  const newObj = { ...obj };
  keys.forEach((k) => {
    delete newObj[k];
  });
  return newObj;
}

interface ShopTableProps {
  items: Gear[];
}

function ShopTable({ items }: ShopTableProps) {
  const { state: character, setState: setCharacter } = useCurrentCharacter();
  const urlParams = useUrlParams();
  const { slotId } = urlParams;
  const router = useRouter();
  const linker = useRelativeLinker();
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <SearchIcon />
        <Input
          className="w-40"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>gear</TableHead>
            <TableHead className="w-40">price</TableHead>
            <TableHead className="w-40">actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items
            .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((g) => (
              <TableRow key={g.id}>
                <TableCell className="p-1">
                  <ShowGear gear={g} />
                </TableCell>
                <TableCell className="p-1">{g.price}</TableCell>
                <TableCell className="p-1">
                  {canGrab(character, g, slotId) && (
                    <Button
                      onClick={() => {
                        setCharacter((d) => grab(d, g, slotId));
                        router.back();
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
    </div>
  );
}

function NewItemDialog() {
  const urlParams = useUrlParams();
  const { slotId } = urlParams;
  const { state: character, setState: setCharacter } = useCurrentCharacter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useImmer<Gear>({ id: uuidv4(), name: "" });
  const lens: ILens<Gear> = { state, setState };
  const router = useRouter();
  const linker = useRelativeLinker();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <PackagePlusIcon /> Custom item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Custom item</DialogTitle>
        <div className="flex flex-col gap-2">
          <div>
            <div>Name</div>
            <TextField lens={lens} fieldName="name" />
          </div>
          <div className="flex gap-2">
            <div>
              <DiceSelect
                allowNoAttack
                dice={state.damage}
                setDice={(v) =>
                  setState((d) => {
                    d.damage = v;
                  })
                }
              />
            </div>
            <div>
              <ArmorSelect
                allowNoArmor
                armor={state.armor}
                setArmor={(v) =>
                  setState((d) => {
                    d.armor = v;
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <div>bulky</div> <CheckboxField lens={lens} fieldName="bulky" />
            </div>
            <div className="flex items-center gap-2">
              <div>blast</div> <CheckboxField lens={lens} fieldName="blast" />
            </div>
          </div>
          <div className="flex gap-2"></div>
          <div>
            <div>Price</div>
            <NumberField lens={lens} fieldName="price" />
          </div>
        </div>
        <Button
          onClick={() => {
            setCharacter((d) => grab(d, state, slotId));
            router.back();
          }}
          disabled={!state.name}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
