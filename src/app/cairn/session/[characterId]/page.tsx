"use client";

import { Ability, Field } from "../../ability";
import { Title } from "@/components/ui/title";
import { TwoColumns } from "@/components/generic-pages/two-columns";
import {
  useCharacterStorage,
  usePlayerConnectionContext,
} from "../../cairn-context";
import { Button } from "@/components/ui/button";

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
            log({ type: "SimpleMessage", props: "test toto" });
          }}
        >
          +
        </Button>
      </div>
    </div>
  );
}

function MessagePanel() {
  const { messages } = usePlayerConnectionContext();
  return (
    <div>
      {messages.map((m) => (
        <div>{JSON.stringify(m.props)}</div>
      ))}
    </div>
  );
}

export default function Session() {
  return (
    <TwoColumns leftPart={<CharacterSheet />} rightPart={<MessagePanel />} />
  );
}
