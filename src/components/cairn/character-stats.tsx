import { AbilityControl } from "./ability-control";
import { HpControl } from "./hp-control";
import { Checkbox } from "../ui/checkbox";
import { getArmorValue } from "@/lib/game/cairn/utils";
import { useCurrentCharacter } from "@/app/cairn/cairn-context";

interface CharacterStatsProps {}

export function CharacterStats({}: CharacterStatsProps) {
  const { state: character, setState: setCharacter } = useCurrentCharacter();

  const armor = getArmorValue(character);

  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <div className="flex gap-12">
        <div className="flex flex-col">
          <AbilityControl type="strength" />
          <AbilityControl type="dexterity" />
          <AbilityControl type="willpower" />
        </div>
        <div className="flex flex-col">
          <HpControl />
          <div className="h-7 flex justify-between">
            <div className="w-20">Armor</div>
            <div>{armor}</div>
          </div>
          <div className="h-7 flex justify-between">
            <div className="w-20">Deprived</div>
            <Checkbox
              defaultChecked={character.deprived}
              onCheckedChange={() =>
                setCharacter((d) => {
                  d.deprived = !d.deprived;
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
