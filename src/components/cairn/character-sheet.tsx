import { CharacterCoins } from "./character-coins";
import { CharacterInventory } from "./character-inventory";
import { CharacterName } from "./character-name";
import { CharacterStats } from "./character-stats";
import { EditCharStats } from "./edit-char-stats";
import { GenericRolls } from "./generic-rolls";
import { useRelativeLinker, useUrlParams } from "@/lib/hooks";
import { CharacterDescriptionDialog } from "./character-description";
import { UserPlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useCurrentCharacter } from "@/app/cairn-context";
import {
  getRandomName,
  initBlankCharacter,
} from "@/lib/game/cairn/character-generation";
import { CharacterCollection } from "./character-collection";
import { getSubLens } from "@/lib/utils";
import { CarryCapacityCollection } from "./carry-capacity-collection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface CharacterSheetProps {}

export function CharacterSheet({}: CharacterSheetProps) {
  const characterLens = useCurrentCharacter();
  const { setState: setCharacter } = characterLens;
  const { characterId } = useUrlParams();
  const linker = useRelativeLinker();
  const hirelingsLens = getSubLens(characterLens, "hireLings");

  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <CharacterName name={characterLens.state.name}>
        <EditCharStats />
        <GenericRolls />
        <CharacterDescriptionDialog />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            setCharacter((d) => {
              const hireling = initBlankCharacter();
              hireling.name = getRandomName();
              d.hireLings.push(hireling);
            })
          }
        >
          <UserPlusIcon className="mr-2" />
        </Button>
      </CharacterName>
      <CharacterStats />
      <CharacterCoins />
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">inventory</TabsTrigger>
          <TabsTrigger value="hirelings">hirelings</TabsTrigger>
          <TabsTrigger value="carry">carry capacity</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <CharacterInventory
            shopLink={(slotId) =>
              linker(`shop?characterId=${characterId}&slotId=${slotId}`)
            }
          />
        </TabsContent>
        <TabsContent value="hirelings">
          <CharacterCollection
            charType="hireling"
            lens={hirelingsLens}
            newChar={(c) => c}
            HeaderMenu={() => <></>}
            Edit={() => <></>}
            Details={() => <></>}
          />
        </TabsContent>
        <TabsContent value="carry">
          <CarryCapacityCollection
            lens={getSubLens(characterLens, "carryCapacities")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
