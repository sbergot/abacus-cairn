import { AbilityControl } from "./ability-control";
import { HpControl } from "./hp-control";
import { Title } from "../ui/typography";
import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import { Checkbox } from "../ui/checkbox";
import { Slot } from "@/lib/game/cairn/types";

interface CharacterStatsProps {}

function sum(values: number[]) {
  return values.reduce((acc, v) => acc + v, 0);
}

export function CharacterStats({}: CharacterStatsProps) {
  const lens = useCurrentCharacter();
  const { state: character, setState: setCharacter } = lens;

  function readArmorValue(slot: Slot) {
    if (slot.state.type !== "gear" || slot.type === "backpack") {
      return 0;
    }

    const values = slot.state.gear.tags.map((t) =>
      t.type === "armor" || t.type === "shield" ? t.armor : 0
    );

    return sum(values);
  }

  const armor = Math.min(3, sum(character.inventory.map(readArmorValue)));

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
