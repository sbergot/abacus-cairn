"use client";

import { Ability, Field } from "../../ability";
import { Title } from "@/components/ui/title";
import { TwoColumns } from "@/components/generic-pages/two-columns";
import {
  useCharacterStorage,
  usePlayerConnectionContext,
} from "../../cairn-context";
import { Button } from "@/components/ui/button";
import { uuidv4 } from "@/lib/utils";
import { MessagePanel, ShowCustomMessageProps } from "@/components/generic-pages/message-panel";
import { Message } from "@/lib/game/cairn/types";

function CharacterSheet() {
  const { character, setCharacter } = useCharacterStorage();
  const { log } = usePlayerConnectionContext();

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <Title>Attributes</Title>
      <div className="flex gap-8">
        <div className="max-w-min">
          <Ability name="Strength" value={character.strength} />
          <Ability name="Dexterity" value={character.dexterity} />
          <Ability name="Willpower" value={character.willpower} />
        </div>
        <div className="max-w-min">
          <Ability name="HP" value={character.hp} />
          <Field name="Armor">0</Field>
        </div>
        <Button
          onClick={() => {
            log({
              kind: "chat-common",
              type: "SimpleMessage",
              props: { content: uuidv4() },
            });
          }}
        >
          common
        </Button>
        <Button
          onClick={() => {
            log({
              kind: "chat-custom",
              type: "AbilityRoll",
              props: { content: uuidv4() },
            });
          }}
        >
          custom
        </Button>
      </div>
    </div>
  );
}

function ShowCustomMessage({ m, ctx }: ShowCustomMessageProps<Message>) {
  return <div>custom message: {m.props.content}</div>
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
