import { AbilityControl } from "./ability-control";
import { HpControl } from "./hp-control";
import { Checkbox } from "../ui/checkbox";
import { getArmorValue } from "@/lib/game/cairn/utils";
import { ILens } from "@/lib/types";
import { CairnCharacter } from "@/lib/game/cairn/types";

interface CharacterStatsProps {
  lens: ILens<CairnCharacter>;
}

export function CharacterStats({ lens }: CharacterStatsProps) {
  const { state: character, setState: setCharacter } = lens;

  const armor = getArmorValue(lens.state);

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
