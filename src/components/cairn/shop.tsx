"use client";

import { CairnCharacter, Gear } from "@/lib/game/cairn/types";
import {
  useCurrentCharacter,
  useLoggerContext,
  useCustomDataContext,
} from "@/app/cairn-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon, Undo2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLens, useUrlParams } from "@/lib/hooks";
import { ShowGear } from "@/components/cairn/show-gear";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  findContainer,
  findFreeSiblingSlot,
  grabItem,
} from "@/lib/game/cairn/utils";
import { NewItemDialog } from "./new-item-dialog";
import { itemsByCategory } from "@/lib/game/cairn/items-data";
import { SearchInput } from "../ui/search-input";

export function Shop() {
  let { customItemsByCategory } = useCustomDataContext();
  customItemsByCategory = customItemsByCategory ?? itemsByCategory;
  const allItems: Gear[] = Object.values(customItemsByCategory).flat();
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
          {Object.keys(customItemsByCategory).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <ShopTable items={allItems} />
        </TabsContent>
        {Object.keys(customItemsByCategory).map((category) => (
          <TabsContent key={category} value={category}>
            <ShopTable
              items={
                customItemsByCategory![
                  category as keyof typeof customItemsByCategory
                ]
              }
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
  const searchLens = useLens("");
  const log = useLoggerContext();

  return (
    <div className="flex flex-col gap-4">
      <SearchInput lens={searchLens} />
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
            .filter((i) =>
              i.name.toLowerCase().includes(searchLens.state.toLowerCase())
            )
            .toSorted((a, b) => a.name.localeCompare(b.name))
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
