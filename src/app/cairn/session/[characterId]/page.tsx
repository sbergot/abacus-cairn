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
import { AbilityType, CairnMessage, RollMode } from "@/lib/game/cairn/types";
import { abilityCheck } from "@/lib/game/cairn/utils";
import { DiceRoll } from "@/components/ui/dice-roll";
import { Title } from "@/components/ui/typography";
import { DicesIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function CharacterSheet() {
  const { character } = useCharacterStorage();

  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <Title>{character.name}</Title>
      <div className="flex gap-12">
        <div className="flex flex-col">
          <AbilityControl type="strength" />
          <AbilityControl type="dexterity" />
          <AbilityControl type="willpower" />
        </div>
        <div className="flex flex-col">
          <HpControl />
          <div className="flex justify-between">
            <div className="w-20">Armor</div>
            <div>0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AbilityControlProps {
  type: AbilityType;
}

function AbilityControl({ type }: AbilityControlProps) {
  const { character, setCharacter } = useCharacterStorage();
  const value = character[type];
  return (
    <div className="flex gap-2 items-stretch justify-between">
      <div className="w-20 capitalize">{type}</div>
      <div>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setCharacter((d) => {
              d[type].current += 1;
            })
          }
        >
          <PlusIcon />
        </Button>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setCharacter((d) => {
              d[type].current -= 1;
            })
          }
        >
          <MinusIcon />
        </Button>
      </div>
      <div className="w-[42px] text-end">
        {value.current}/{value.max}
      </div>
      <div>
        <AbilityCheckModal type={type} />
      </div>
    </div>
  );
}

function HpControl() {
  const { character, setCharacter } = useCharacterStorage();
  const value = character.hp;
  return (
    <div className="flex gap-2 items-stretch justify-between">
      <div className="w-20">HP</div>
      <div>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setCharacter((d) => {
              d.hp.current += 1;
            })
          }
        >
          <PlusIcon />
        </Button>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setCharacter((d) => {
              d.hp.current -= 1;
            })
          }
        >
          <MinusIcon />
        </Button>
      </div>
      <div>
        {value.current}/{value.max}
      </div>
    </div>
  );
}

function ShowCustomMessage({ m, ctx }: ShowCustomMessageProps<CairnMessage>) {
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
        <MessagePanel<CairnMessage>
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
        <Button size="icon-xs" variant="ghost">
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
