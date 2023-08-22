import { AbilityCheckDialog } from "@/components/cairn/ability-check-dialog";
import { CharacterStatsView } from "@/components/cairn/character-stats-view";
import { Title } from "@/components/ui/typography";
import { CairnCharacter, AbilityType } from "@/lib/game/cairn/types";

interface CharacterEntryProps {
  character: CairnCharacter;
}

export function CharacterEntry({ character }: CharacterEntryProps) {
  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <Title>{character.name}</Title>
      <CharacterStatsView character={character} />
    </div>
  );
}

interface AbilityShow {
  character: CairnCharacter;
  type: AbilityType;
}

function AbilityShow({ character, type }: AbilityShow) {
  const value = character[type];
  return (
    <div className="flex gap-2 items-stretch justify-between">
      <div className="w-20 capitalize">{type}</div>
      <div className="w-[42px] text-end">
        {value.current}/{value.max}
      </div>
      <div>
        <AbilityCheckDialog type={type} character={character} />
      </div>
    </div>
  );
}

interface HpShowProps {
  character: CairnCharacter;
}

function HpShow({ character }: HpShowProps) {
  const value = character.hp;
  return (
    <div className="flex gap-2 items-stretch justify-between">
      <div className="w-20">HP</div>
      <div>
        {value.current}/{value.max}
      </div>
    </div>
  );
}
