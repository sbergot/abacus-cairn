"use client";

import { CairnMessage } from "@/lib/game/cairn/types";
import { ShowCustomMessageProps } from "../generic-pages/message-panel";
import { DiceRoll } from "../ui/dice-roll";
import { TakeDamage } from "./take-damage";
import { RollScar } from "./roll-scar";
import { GmDealDamageDialog } from "./gm-deal-damage-dialog";
import { InviteNpc } from "./invite-npc";
import { TakeItemDialog } from "./take-item-dialog";
import { RemoveMessage } from "./remove-message";

export function ShowCairnMessage({
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
        <div>
          {m.props.dice.number === 1 && (
            <>
              1d{m.props.dice.sides} → {m.props.result.rollValue}
            </>
          )}
          {m.props.dice.number > 1 && (
            <>
              ({m.props.dice.number}d{m.props.dice.sides}){" "}
              <DiceRoll results={m.props.result} /> → {m.props.result.rollValue}
            </>
          )}
        </div>
        {ctx.contextType === "player" && (
          <TakeDamage damages={m.props.result.rollValue} />
        )}
        {ctx.contextType === "gm" && (
          <GmDealDamageDialog damages={m.props.result.rollValue} />
        )}
      </>
    );
  }
  if (m.type === "Scarred") {
    return (
      <>
        <div>Please roll on the scars table</div>
        {ctx.contextType === "player" && <RollScar />}
      </>
    );
  }
  if (m.type === "NpcShare") {
    return (
      <>
        <div>Npc shared: {m.props.npc.name}</div>
        {ctx.contextType === "player" && <InviteNpc npc={m.props.npc} />}
        {ctx.contextType === "gm" && (
          <RemoveMessage
            filter={(m2) =>
              m2.kind === "chat-custom" &&
              m2.type === "NpcShare" &&
              m2.props.npc.id === m.props.npc.id
            }
          />
        )}
      </>
    );
  }
  if (m.type === "ItemShare") {
    return (
      <>
        <div>Item shared: {m.props.item.name}</div>
        {ctx.contextType === "player" && <TakeItemDialog item={m.props.item} />}
        {ctx.contextType === "gm" && (
          <RemoveMessage
            filter={(m2) =>
              m2.kind === "chat-custom" &&
              m2.type === "ItemShare" &&
              m2.props.item.id === m.props.item.id
            }
          />
        )}
      </>
    );
  }
}
