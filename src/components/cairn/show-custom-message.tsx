import { CairnCharacter, CairnMessage } from "@/lib/game/cairn/types";
import { ShowCustomMessageProps } from "../generic-pages/message-panel";
import { DiceRoll } from "../ui/dice-roll";
import { Button } from "../ui/button";
import { useCurrentCharacter, useLoggerContext } from "@/app/cairn/cairn-context";
import { AllChatMessage } from "@/lib/network/types";
import { getArmorValue } from "@/lib/game/cairn/utils";

export function ShowCustomMessage({
  m,
  ctx,
}: ShowCustomMessageProps<CairnMessage>) {
  if (m.type === "AbilityRoll") {
    return (
      <div>
        {m.props.check.mode !== "normal" && (
          <div>rolling with {m.props.check.mode}</div>
        )}
        <div>
          <DiceRoll results={m.props.results} /> vs {m.props.check.abilityValue}{" "}
          → {m.props.isSuccess ? "success" : "failure"}
        </div>
      </div>
    );
  }
  if (m.type === "AttackRoll") {
    return (
      <>
        <div>{m.props.result}</div>
        {ctx.contextType === "player" && (
          <TakeDamage damages={m.props.result} />
        )}
      </>
    );
  }
}

interface TakeDamageProps {
  damages: number;
}

function TakeDamage({ damages }: TakeDamageProps) {
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

function hurt(character: CairnCharacter, damages: number, log: (m: AllChatMessage<CairnMessage>) => void) {

  const adjusted = damages - getArmorValue(character);

  if (character.hp.current > adjusted) {
    character.hp.current -= adjusted;
    return;
  }

  if (character.hp.current === adjusted) {
    character.hp.current = 0;
    log({
      kind: "chat-common",
      type: "SimpleMessage",
      props: { content: "Please roll on the scars table" }
    })
    return;
  }

  if (character.hp.current < adjusted) {
    const residual = adjusted - character.hp.current;
    character.hp.current = 0;
    character.strength.current -= residual;
    return;
  }
}