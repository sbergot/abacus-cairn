"use client"

import {
  useCurrentCharacter,
  useLoggerContext,
} from "@/app/cairn/cairn-context";
import { CairnCharacter, CairnMessage } from "@/lib/game/cairn/types";
import { getArmorValue } from "@/lib/game/cairn/utils";
import { AllChatMessage } from "@/lib/network/types";
import { Button } from "../ui/button";

interface TakeDamageProps {
  damages: number;
}

export function TakeDamage({ damages }: TakeDamageProps) {
  const { setState } = useCurrentCharacter();
  const { log } = useLoggerContext();
  return (
    <Button
      onClick={() =>
        setState((d) => {
          hurt(d, damages, log);
        })
      }
    >
      Take damage
    </Button>
  );
}

function hurt(
  character: CairnCharacter,
  damages: number,
  log: (m: AllChatMessage<CairnMessage>) => void
) {
  const adjusted = damages - getArmorValue(character);

  if (character.hp.current > adjusted) {
    character.hp.current -= adjusted;
    return;
  }

  if (character.hp.current === adjusted) {
    character.hp.current = 0;
    log({
      kind: "chat-custom",
      type: "Scarred",
      props: {},
    });
    return;
  }

  if (character.hp.current < adjusted) {
    const residual = adjusted - character.hp.current;
    character.hp.current = 0;
    character.strength.current -= residual;
    log({
      kind: "chat-common",
      type: "BasicMessage",
      props: { content: "Make a strength save to avoid critical damage." },
    });
    return;
  }
}
