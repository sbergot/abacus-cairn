import { CharacterCoins } from "./character-coins";
import { CharacterInventory } from "./character-inventory";
import { TitleWithIcons } from "../ui/title-with-icons";
import { CharacterStats } from "./character-stats";
import { EditCharStats } from "./edit-char-stats";
import { GenericRolls } from "./generic-rolls";
import { useRelativeLinker, useUrlParams } from "@/lib/hooks";
import { CharacterDescriptionDialog } from "./character-description-dialog";
import { useCurrentCharacter, useGameContext } from "@/app/cairn-context";
import { CharacterCollection } from "./character-collection";
import { getSubLens, getSubRecordLens } from "@/lib/utils";
import { CarryCapacityCollection } from "./carry-capacity-collection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NewCharacterDialog } from "./new-character-dialog";
import { Button } from "../ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { ILens } from "@/lib/types";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { switchHirelingToMainCharacter } from "@/lib/game/cairn/utils";
import { MenuEntry } from "../ui/menu-entry";
import { CardMenu } from "../ui/card-menu";

export function CharacterSheet() {
  const characterLens = useCurrentCharacter();
  const { characterId } = useUrlParams();
  const linker = useRelativeLinker();
  const hirelingsLens = getSubLens(characterLens, "hireLings");

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex flex-col items-stretch gap-4 max-w-md w-full">
        <TitleWithIcons name={characterLens.state.name}>
          <CardMenu>
            <MenuEntry>
              <EditCharStats />
            </MenuEntry>
            <MenuEntry>
              <CharacterDescriptionDialog />
            </MenuEntry>
            <MenuEntry>
              <GenericRolls />
            </MenuEntry>
          </CardMenu>
        </TitleWithIcons>
        <CharacterStats />
        <CharacterCoins />
      </div>
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
              HeaderMenu={SwitchAsMain}
              Edit={() => <></>}
              Details={() => <></>}
            />
          </div>
        </TabsContent>
        <TabsContent value="carry">
          <CarryCapacityCollection characterLens={characterLens} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SwitchAsMain({
  characterLens: hirelingsLens,
}: {
  characterLens: ILens<CairnCharacter>;
}) {
  const { characterId } = useUrlParams();
  const { characterRepo } = useGameContext();
  const hirelingId = hirelingsLens.state.id;
  const mainCharacterLens = getSubRecordLens(characterRepo, characterId);
  return (
    <MenuEntry>
      <Button
        variant="ghost"
        size="icon-sm"
        className="flex gap-2 w-full"
        onClick={() => {
          mainCharacterLens.setState((d) =>
            switchHirelingToMainCharacter(d, hirelingId)
          );
        }}
      >
        <ArrowUpDownIcon /> <div className="flex-grow text-left">Switch as main</div>
      </Button>
    </MenuEntry>
  );
}
