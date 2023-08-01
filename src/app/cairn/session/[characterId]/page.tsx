"use client";

import { Ability, Field } from "../../ability";
import { TwoColumns } from "@/components/generic-pages/two-columns";
import {
  useCharacterStorage,
  usePlayerConnectionContext,
} from "../../cairn-context";
import { Button } from "@/components/ui/button";
import {
  MessagePanel,
  ShowCustomMessageProps,
} from "@/components/generic-pages/message-panel";
import { AbilityType, Message, RollMode } from "@/lib/game/cairn/types";
import { abilityCheck } from "@/lib/game/cairn/utils";
import { DiceRoll } from "@/components/ui/dice-roll";
import { Title } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DicesIcon } from "lucide-react";
import { useState } from "react";

function CharacterSheet() {
  const { character } = useCharacterStorage();

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <Title>Attributes</Title>
      <div className="flex gap-8">
        <div className="max-w-min">
          <AbilityControl type="strength" />
          <AbilityControl type="dexterity" />
          <AbilityControl type="willpower" />
        </div>
        <div className="max-w-min">
          <Ability name="HP" value={character.hp} />
          <Field name="Armor">0</Field>
        </div>
      </div>
    </div>
  );
}

interface AbilityControlProps {
  type: AbilityType;
}

function AbilityControl({ type }: AbilityControlProps) {
  const { character } = useCharacterStorage();
  return (
    <div className="flex items-center gap-2 justify-between w-full">
      <Ability name={type} value={character[type]} />
      <AbilityCheckModal type={type} />
    </div>
  );
}

function ShowCustomMessage({ m, ctx }: ShowCustomMessageProps<Message>) {
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

export default function Session() {
  const { character } = useCharacterStorage();
  const { messages } = usePlayerConnectionContext();
  return (
    <TwoColumns
      leftPart={<CharacterSheet />}
      rightPart={
        <MessagePanel<Message>
          context={{ contextType: "player", authorId: character.id }}
          messages={messages}
          ShowCustomMessage={ShowCustomMessage}
        />
      }
    />
  );
}

interface AbilityCheckModalProps {
  type: AbilityType;
}

export function AbilityCheckModal({ type }: AbilityCheckModalProps) {
  const { character } = useCharacterStorage();
  const { log } = usePlayerConnectionContext();
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
        <Button size="icon-sm" variant="ghost">
          <DicesIcon size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type} check</DialogTitle>
          <div className="flex gap-1">
            <Button onClick={() => roll("normal")}>normal</Button>
            <Button onClick={() => roll("advantage")}>advantage</Button>
            <Button onClick={() => roll("disadvantage")}>disadvantage</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
