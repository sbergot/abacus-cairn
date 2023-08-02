"use client";

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
import { DicesIcon } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function CharacterSheet() {
  const { character } = useCharacterStorage();

  return (
    <div className="flex flex-col gap-4 max-w-sm items-start">
      <Title>Attributes</Title>
      <div className="flex gap-8">
        <div className="grid grid-cols-2 gap-2 items-end auto-rows-[32px]">
          <AbilityControl type="strength" />
          <AbilityControl type="dexterity" />
          <AbilityControl type="willpower" />
        </div>
        <div className="grid grid-cols-2 gap-2 items-end auto-rows-[32px]">
          <div>HP</div>
          <div>
            {character.hp.current}/{character.hp.max}
          </div>
          <div>Armor</div>
          <div>0</div>
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
  const value = character[type];
  return (
    <>
      <div>{type}</div>
      <div>
        <span>
          {value.current}/{value.max}
        </span>
        <AbilityCheckModal type={type} />
      </div>
    </>
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon-sm" variant="ghost">
          <DicesIcon size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xl w-full" side="right">
        <div className="flex gap-1">
          <Button onClick={() => roll("normal")}>normal</Button>
          <Button onClick={() => roll("advantage")}>advantage</Button>
          <Button onClick={() => roll("disadvantage")}>disadvantage</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
