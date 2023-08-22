import { AbilityCheckDialog } from "@/components/cairn/ability-check-dialog";
import { Title } from "@/components/ui/typography";
import { CairnCharacter, AbilityType } from "@/lib/game/cairn/types";

interface CharacterEntryProps {
  character: CairnCharacter;
}

export function CharacterEntry({ character }: CharacterEntryProps) {
  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <Title>{character.name}</Title>
      <div className="flex gap-12">
        <div className="flex flex-col">
          <AbilityShow type="strength" character={character} />
          <AbilityShow type="dexterity" character={character} />
          <AbilityShow type="willpower" character={character} />
        </div>
        <div className="flex flex-col">
          <HpShow character={character} />
          <div className="flex justify-between">
            <div className="w-20">Armor</div>
            <div>0</div>
          </div>
        </div>
      </div>
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
