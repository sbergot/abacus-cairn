import { useLoggerContext } from "@/app/cairn-context";
import { AbilityType, CairnCharacter, RollMode } from "@/lib/game/cairn/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { DicesIcon } from "lucide-react";
import { abilityCheck } from "@/lib/game/cairn/utils";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { ButtonLike } from "../ui/button-like";

interface AbilityCheckModalProps {
  type: AbilityType;
  character: CairnCharacter;
}

export function AbilityCheckDialog({ type, character }: AbilityCheckModalProps) {
  const log = useLoggerContext();
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonLike size="icon-xs" variant="ghost">
          <DicesIcon  />
        </ButtonLike>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <div className="flex flex-col gap-1 max-w-xs">
          <Button onClick={() => roll("normal")}>normal</Button>
          <Button onClick={() => roll("advantage")}>advantage</Button>
          <Button onClick={() => roll("disadvantage")}>disadvantage</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}