import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import { CharacterCoins } from "./character-coins";
import { CharacterInventory } from "./character-inventory";
import { CharacterName } from "./character-name";
import { CharacterStats } from "./character-stats";
import { EditCharStats } from "./edit-char-stats";
import { GenericRolls } from "./generic-rolls";
import { useRelativeLinker, useUrlParams } from "@/lib/hooks";

interface CharacterSheetProps {}

export function CharacterSheet({}: CharacterSheetProps) {
  const { characterId } = useUrlParams();
  const linker = useRelativeLinker();

  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <CharacterName>
        <EditCharStats />
        <GenericRolls />
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
