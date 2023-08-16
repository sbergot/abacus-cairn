import { AbilityControl } from "./ability-control";
import { HpControl } from "./hp-control";
import { Title } from "../ui/typography";
import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import { Checkbox } from "../ui/checkbox";
import { getArmorValue } from "@/lib/game/cairn/utils";

interface CharacterStatsProps {}

export function CharacterStats({}: CharacterStatsProps) {
  const lens = useCurrentCharacter();
  const { state: character, setState: setCharacter } = lens;

  const armor = getArmorValue(lens.state);

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
          <div className="h-7 flex justify-between">
            <div className="w-20">Armor</div>
            <div>{armor}</div>
          </div>
          <div className="h-7 flex justify-between">
            <div className="w-20">Deprived</div>
            <Checkbox
              defaultChecked={character.deprived}
              onChange={() =>
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
