import { CairnCharacter, CairnMessage } from "@/lib/game/cairn/types";
import { ShowCustomMessageProps } from "../generic-pages/message-panel";
import { DiceRoll } from "../ui/dice-roll";
import { Button } from "../ui/button";
import { useCurrentCharacter } from "@/app/cairn/cairn-context";

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
  return (
    <Button
      onClick={() =>
        setState((d) => {
          hurt(d, damages);
        })
      }
    >
      Take damage
    </Button>
  );
}

function hurt(character: CairnCharacter, damages: number) {
  if (character.hp.current > damages) {
    character.hp.current -= damages;
    return;
  }

  if (character.hp.current === damages) {
    character.hp.current = 0;
    return;
  }

  if (character.hp.current < damages) {
    const residual = damages - character.hp.current;
    character.hp.current = 0;
    character.strength.current -= residual;
    return;
  }
}