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
  initCharacter,
} from "@/lib/game/cairn/character-generation";

interface CharacterSheetProps {}

export function CharacterSheet({}: CharacterSheetProps) {
  const { setState: setCharacter } = useCurrentCharacter();
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
              const hireling = initCharacter();
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
    </div>
  );
}
