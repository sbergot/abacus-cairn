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
  initBasicCharacter,
  initBlankCharacter,
} from "@/lib/game/cairn/character-generation";
import { CharacterCollection } from "./character-collection";
import { getSubLens } from "@/lib/utils";

interface CharacterSheetProps {}

export function CharacterSheet({}: CharacterSheetProps) {
  const characterLens = useCurrentCharacter();
  const { setState: setCharacter } = characterLens;
  const { characterId } = useUrlParams();
  const linker = useRelativeLinker();

  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <CharacterName>
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
      <CharacterInventory
        shopLink={(slotId) =>
          linker(`shop?characterId=${characterId}&slotId=${slotId}`)
        }
      />
      <CharacterCollection
        charType="hireling"
        lens={getSubLens(characterLens, "hireLings")}
        newChar={initBasicCharacter}
        Tools={() => <></>}
      />
    </div>
  );
}
