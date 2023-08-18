"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { MessagePanel } from "@/components/generic-pages/message-panel";
import {
  AbilityType,
  CairnCharacter,
  CairnMessage,
} from "@/lib/game/cairn/types";
import { useGmConnectionContext } from "@/app/cairn/cairn-context";
import { ShowCustomMessage } from "@/components/cairn/show-custom-message";
import { Title } from "@/components/ui/typography";
import { AbilityCheckModal } from "@/components/cairn/ability-check-modal";

export default function Session() {
  const { messages } = useGmConnectionContext();
  return (
    <TwoColumns
      leftPart={<AllCharacters />}
      rightPart={
        <MessagePanel<CairnMessage>
          context={{ contextType: "gm", authorId: "gm" }}
          messages={messages}
          ShowCustomMessage={ShowCustomMessage}
        />
      }
    />
  );
}

interface AllCharactersProps {}

function AllCharacters({}: AllCharactersProps) {
  const { connections, sessionCode } = useGmConnectionContext();
  const allCharacters = connections
    .map((conn) => conn.character)
    .filter((c) => !!c) as CairnCharacter[];

  return (
    <>
      <div>{sessionCode}</div>
      {allCharacters.map((c) => (
        <CharacterEntry key={c.id} character={c} />
      ))}
    </>
  );
}

interface CharacterEntryProps {
  character: CairnCharacter;
}

function CharacterEntry({ character }: CharacterEntryProps) {
  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <Title>{character.name}</Title>
      <div className="flex gap-12">
        <div className="flex flex-col">
          <AbilityShow type="strength" character={character} />
          <AbilityShow type="dexterity" character={character} />
          <AbilityShow type="willpower" character={character} />
        </div>
        <div className="flex flex-col">
          <HpShow character={character} />
          <div className="flex justify-between">
            <div className="w-20">Armor</div>
            <div>0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AbilityShow {
  character: CairnCharacter;
  type: AbilityType;
}

function AbilityShow({ character, type }: AbilityShow) {
  const value = character[type];
  return (
    <div className="flex gap-2 items-stretch justify-between">
      <div className="w-20 capitalize">{type}</div>
      <div className="w-[42px] text-end">
        {value.current}/{value.max}
      </div>
      <div>
        <AbilityCheckModal type={type} character={character} />
      </div>
    </div>
  );
}

interface HpShowProps {
  character: CairnCharacter;
}

function HpShow({ character }: HpShowProps) {
  const value = character.hp;
  return (
    <div className="flex gap-2 items-stretch justify-between">
      <div className="w-20">HP</div>
      <div>
        {value.current}/{value.max}
      </div>
    </div>
  );
}
