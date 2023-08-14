import { AbilityType, CairnCharacter } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { AbilityCheckModal } from "./ability-check-modal";

interface AbilityControlProps {
  type: AbilityType;
  characterLens: ILens<CairnCharacter>;
}

export function AbilityControl({ type, characterLens }: AbilityControlProps) {
  const { state: character, setState: setCharacter } = characterLens;
  const value = character[type];
  return (
    <div className="flex gap-2 items-stretch justify-between">
      <div className="w-20 capitalize">{type}</div>
      <div>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setCharacter((d) => {
              d[type].current += 1;
            })
          }
        >
          <PlusIcon />
        </Button>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setCharacter((d) => {
              d[type].current -= 1;
            })
          }
        >
          <MinusIcon />
        </Button>
      </div>
      <div className="w-[42px] text-end">
        {value.current}/{value.max}
      </div>
      <div>
        <AbilityCheckModal type={type} character={character} />
      </div>
    </div>
  );
}