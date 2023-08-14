import { CairnMessage } from "@/lib/game/cairn/types";
import { ShowCustomMessageProps } from "../generic-pages/message-panel";
import { DiceRoll } from "../ui/dice-roll";

export function ShowCustomMessage({ m, ctx }: ShowCustomMessageProps<CairnMessage>) {
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
}