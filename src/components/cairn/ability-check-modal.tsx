import { useLoggerContext } from "@/app/cairn/cairn-context";
import { AbilityType, CairnCharacter, RollMode } from "@/lib/game/cairn/types";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { DicesIcon } from "lucide-react";
import { abilityCheck } from "@/lib/game/cairn/utils";

interface AbilityCheckModalProps {
  type: AbilityType;
  character: CairnCharacter;
}

export function AbilityCheckModal({ type, character }: AbilityCheckModalProps) {
  const { log } = useLoggerContext();
  const [open, setOpen] = useState(false);

  function roll(mode: RollMode) {
    log({
      kind: "chat-custom",
      type: "AbilityRoll",
      title: type + " check",
      props: abilityCheck({
        abilityName: type,
        abilityValue: character[type].current,
        mode,
      }),
    });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon-xs" variant="ghost">
          <DicesIcon size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xl w-full" side="right" data-side="bottom">
        <div className="flex flex-col gap-1">
          <Button onClick={() => roll("normal")}>normal</Button>
          <Button onClick={() => roll("advantage")}>advantage</Button>
          <Button onClick={() => roll("disadvantage")}>disadvantage</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}