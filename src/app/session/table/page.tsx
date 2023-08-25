"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { CairnMessage } from "@/lib/game/cairn/types";
import {
  useCurrentCharacter,
  usePlayerConnectionContext,
} from "@/app/cairn-context";
import { ShowCustomMessage } from "@/components/cairn/show-custom-message";
import { CharacterSheet } from "@/components/cairn/character-sheet";
import { RightPanel } from "@/components/generic-pages/right-panel";

export default function Session() {
  const characterLens = useCurrentCharacter();
  const { messages, revealedElements } = usePlayerConnectionContext();
  return (
    <TwoColumns
      leftPart={<CharacterSheet />}
      rightPart={
        <RightPanel<CairnMessage>
          context={{ contextType: "player", authorId: characterLens.state.id }}
          messages={messages}
          ShowCustomMessage={ShowCustomMessage}
          elements={revealedElements}
        />
      }
    />
  );
}
