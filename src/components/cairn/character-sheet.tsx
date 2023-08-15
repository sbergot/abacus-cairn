import { AbilityControl } from "./ability-control";
import { HpControl } from "./hp-control";
import { Title } from "../ui/typography";
import { useCurrentCharacter } from "@/app/cairn/cairn-context";

interface CharacterSheetProps {}

export function CharacterSheet({}: CharacterSheetProps) {
  const { state: character } = useCurrentCharacter();

  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <Title>{character.name}</Title>
      <div className="flex gap-12">
        <div className="flex flex-col">
          <AbilityControl type="strength" />
          <AbilityControl type="dexterity" />
          <AbilityControl type="willpower" />
        </div>
        <div className="flex flex-col">
          <HpControl />
          <div className="flex justify-between">
            <div className="w-20">Armor</div>
            <div>0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
