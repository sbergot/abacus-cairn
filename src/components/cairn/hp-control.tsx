import { Button } from "../ui/button";
import { PlusIcon, MinusIcon } from "lucide-react";
import { useCurrentCharacter } from "@/app/cairn/cairn-context";

interface HpControlProps {}

export function HpControl({}: HpControlProps) {
  const { state: character, setState: setCharacter } = useCurrentCharacter();
  const value = character.hp;
  return (
    <div className="flex gap-2 items-stretch justify-between">
      <div className="w-20">HP</div>
      <div>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setCharacter((d) => {
              d.hp.current += 1;
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
              d.hp.current -= 1;
            })
          }
        >
          <MinusIcon />
        </Button>
      </div>
      <div>
        {value.current}/{value.max}
      </div>
    </div>
  );
}
