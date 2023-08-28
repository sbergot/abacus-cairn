"use client"

import { CairnMessage } from "@/lib/game/cairn/types";
import { ShowCustomMessageProps } from "../generic-pages/message-panel";
import { DiceRoll } from "../ui/dice-roll";
import { TakeDamage } from "./take-damage";
import { RollScar } from "./roll-scar";
import { GmDealDamageDialog } from "./gm-deal-damage-dialog";
import { InviteNpc } from "./invite-npc";

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
        {ctx.contextType === "gm" && (
          <GmDealDamageDialog damages={m.props.result} />
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
  if (m.type === "NpcShare") {
    return <>
      <div>Npc shared: {m.props.npc.name}</div>
      {ctx.contextType === "player" && <InviteNpc npc={m.props.npc} />}
    </>
  }
}

