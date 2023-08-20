import {
  CurrentCharacterContextProvider,
  useCurrentGame,
} from "@/app/cairn/cairn-context";
import { CharacterInventoryDialog } from "@/components/cairn/character-inventory-dialog";
import { CharacterName } from "@/components/cairn/character-name";
import { CharacterStats } from "@/components/cairn/character-stats";
import { EditCharStats } from "@/components/cairn/edit-char-stats";
import { GenericRolls } from "@/components/cairn/generic-rolls";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { initCharacter } from "@/lib/game/cairn/character-generation";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import { getSubArrayLens, getSubLens } from "@/lib/utils";

export function AllTables() {
  return (
    <div>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="npcs">
          <AccordionTrigger>NPCs</AccordionTrigger>
          <AccordionContent>
            <AllNpcs />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function AllNpcs() {
  const gameLens = useCurrentGame();
  const npcsLens = getSubLens(gameLens, "npcs");
  return (
    <div>
      <Button
        onClick={() =>
          npcsLens.setState((d) => {
            const newNpc: CairnCharacter = initCharacter();
            newNpc.strength = { current: 10, max: 10 };
            newNpc.dexterity = { current: 10, max: 10 };
            newNpc.willpower = { current: 10, max: 10 };
            newNpc.name = "new npc";
            d.push(newNpc);
          })
        }
      >
        New
      </Button>
      {npcsLens.state.map((npc, idx) => {
        const npcLens: ILens<CairnCharacter> = getSubArrayLens(npcsLens, idx);
        return (
          <CurrentCharacterContextProvider value={npcLens}>
            <CharacterName>
              <EditCharStats />
              <CharacterInventoryDialog />
            </CharacterName>
            <CharacterStats />
          </CurrentCharacterContextProvider>
        );
      })}
    </div>
  );
}
