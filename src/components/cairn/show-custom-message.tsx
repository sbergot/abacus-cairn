import { CairnMessage } from "@/lib/game/cairn/types";
import { ShowCustomMessageProps } from "../generic-pages/message-panel";
import { DiceRoll } from "../ui/dice-roll";
import { TakeDamage } from "./take-damage";
import { RollScar } from "./roll-scar";

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
        <div>1d{m.props.dice} → {m.props.result}</div>
        {ctx.contextType === "player" && (
          <TakeDamage damages={m.props.result} />
        )}
      </>
    );
  }
  if (m.type === "Scarred") {
    return (
      <>
        <div>Please roll on the scars table</div>
        {ctx.contextType === "player" && (
          <RollScar />
        )}
      </>
    );
  }
}

