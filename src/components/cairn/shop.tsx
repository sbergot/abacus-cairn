"use client";

import { CairnCharacter, Gear } from "@/lib/game/cairn/types";
import { useCurrentCharacter, useLoggerContext, useShopItemsContext } from "@/app/cairn-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon, Undo2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUrlParams } from "@/lib/hooks";
import { ShowGear } from "@/components/cairn/show-gear";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  findContainer,
  findFreeSiblingSlot,
  grabItem,
} from "@/lib/game/cairn/utils";
import { NewItemDialog } from "./new-item-dialog";

export function Shop() {
  const itemsByCategory = useShopItemsContext();
  const allItems: Gear[] = Object.values(itemsByCategory).flat();
  const { setState: setCharacter } = useCurrentCharacter();
  const router = useRouter();
  const log = useLoggerContext();
  const urlParams = useUrlParams();
  const { slotId } = urlParams;
  return (
    <>
      <Button onClick={() => router.back()} className="mr-2">
        <Undo2Icon /> Back
      </Button>
      <NewItemDialog
        onCreate={(g) => {
          setCharacter((d) => grabItem(d, g, slotId, log));
          router.back();
        }}
      />
      <Tabs className="mt-2" defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {Object.keys(itemsByCategory).map((category) => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <ShopTable items={allItems} />
        </TabsContent>
        {Object.keys(itemsByCategory).map((category) => (
          <TabsContent key={category} value={category}>
            <ShopTable
              items={itemsByCategory[category as keyof typeof itemsByCategory]}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

function canGrab(
  character: CairnCharacter,
  gear: Gear,
  slotId: string
): boolean {
  const currentContainer = findContainer(character, slotId);
  const currentSlot = currentContainer.find((s) => s.id === slotId)!;
  const siblingFreeSlot = findFreeSiblingSlot(currentContainer, currentSlot);

  if (currentSlot.state.type !== "empty") {
    return false;
  }

  if (!siblingFreeSlot && gear.bulky) {
    return false;
  }

  return true;
}

interface ShopTableProps {
  items: Gear[];
}

function ShopTable({ items }: ShopTableProps) {
  const { state: character, setState: setCharacter } = useCurrentCharacter();
  const urlParams = useUrlParams();
  const { slotId } = urlParams;
  const router = useRouter();
  const [search, setSearch] = useState("");
  const log = useLoggerContext();

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
                        setCharacter((d) => grabItem(d, g, slotId, log));
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
