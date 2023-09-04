"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { MessagePanel } from "@/components/generic-pages/message-panel";
import { CairnMessage } from "@/lib/game/cairn/types";
import {
  useCurrentCharacter,
  usePlayerConnectionContext,
} from "@/app/cairn-context";
import { ShowCairnMessage } from "@/components/cairn/show-cairn-message";
import { CharacterSheet } from "@/components/cairn/character-sheet";

export default function Session() {
  const characterLens = useCurrentCharacter();
  const { messages } = usePlayerConnectionContext();
  return (
    <TwoColumns
      leftPart={<CharacterSheet />}
      rightPart={
        <MessagePanel<CairnMessage>
          context={{ contextType: "player", authorId: characterLens.state.id }}
          messages={messages}
          ShowCustomMessage={ShowCairnMessage}
        />
      }
    />
  );
}
