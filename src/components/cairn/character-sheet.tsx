import { CharacterCoins } from "./character-coins";
import { CharacterInventory } from "./character-inventory";
import { CharacterName } from "./character-name";
import { CharacterStats } from "./character-stats";
import { EditCharStats } from "./edit-char-stats";
import { GenericRolls } from "./generic-rolls";
import { useRelativeLinker, useUrlParams } from "@/lib/hooks";
import { CharacterDescriptionDialog } from "./character-description";
import { useCurrentCharacter } from "@/app/cairn-context";
import { CharacterCollection } from "./character-collection";
import { getSubLens } from "@/lib/utils";
import { CarryCapacityCollection } from "./carry-capacity-collection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TooltipShort } from "../ui/tooltip-short";
import { NewCharacterDialog } from "./new-character-dialog";

interface CharacterSheetProps {}

export function CharacterSheet({}: CharacterSheetProps) {
  const characterLens = useCurrentCharacter();
  const { characterId } = useUrlParams();
  const linker = useRelativeLinker();
  const hirelingsLens = getSubLens(characterLens, "hireLings");

  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <CharacterName name={characterLens.state.name}>
        <TooltipShort name="Edit stats">
          <EditCharStats />
        </TooltipShort>
        <TooltipShort name="Generic rolls">
          <GenericRolls />
        </TooltipShort>
        <TooltipShort name="View details">
          <CharacterDescriptionDialog />
        </TooltipShort>
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
          <div className="flex flex-col gap-2 items-start">
            <NewCharacterDialog
              charType="npc"
              onCreate={(c) => {
                hirelingsLens.setState((d) => {
                  d.push(c);
                });
              }}
            />
            <CharacterCollection
              charType="hireling"
              lens={hirelingsLens}
              HeaderMenu={() => <></>}
              Edit={() => <></>}
              Details={() => <></>}
            />
          </div>
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
