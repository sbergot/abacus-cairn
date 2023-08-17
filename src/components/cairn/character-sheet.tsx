import { CharacterCoins } from "./character-coins";
import { CharacterInventory } from "./character-inventory";
import { CharacterName } from "./character-name";
import { CharacterStats } from "./character-stats";

interface CharacterSheetProps {}

export function CharacterSheet({}: CharacterSheetProps) {
  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <CharacterName />
      <CharacterStats />
      <CharacterCoins />
      <CharacterInventory />
    </div>
  );
}
