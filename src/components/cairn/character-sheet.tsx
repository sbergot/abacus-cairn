import { CairnCharacter } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import { AbilityControl } from "./ability-control";
import { HpControl } from "./hp-control";
import { Title } from "../ui/typography";

interface CharacterSheetProps {
  characterLens: ILens<CairnCharacter>;
}

export function CharacterSheet({ characterLens }: CharacterSheetProps) {
  const { state: character } = characterLens;

  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <Title>{character.name}</Title>
      <div className="flex gap-12">
        <div className="flex flex-col">
          <AbilityControl type="strength" characterLens={characterLens} />
          <AbilityControl type="dexterity" characterLens={characterLens} />
          <AbilityControl type="willpower" characterLens={characterLens} />
        </div>
        <div className="flex flex-col">
          <HpControl characterLens={characterLens} />
          <div className="flex justify-between">
            <div className="w-20">Armor</div>
            <div>0</div>
          </div>
        </div>
      </div>
    </div>
  );
}