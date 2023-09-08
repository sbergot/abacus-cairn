"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { MessagePanel } from "@/components/generic-pages/message-panel";
import { CairnCharacter, CairnMessage } from "@/lib/game/cairn/types";
import {
  CurrentCharacterContextProvider,
  useCurrentCharacter,
  usePlayerConnectionContext,
} from "@/app/cairn-context";
import { ShowCairnMessage } from "@/components/cairn/show-cairn-message";
import { Shop } from "@/components/cairn/shop";
import { useUrlParams } from "@/lib/hooks";
import { getSubLens, getSubArrayLensById } from "@/lib/utils";
import { ILens } from "@/lib/types";

export default function Session() {
  const characterLens = useCurrentCharacter();
  const { messages } = usePlayerConnectionContext();
  return (
    <TwoColumns
      leftPart={<HirelingShop />}
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


function HirelingShop() {
  const charLens = useCurrentCharacter();
  let shoppingCharLens: ILens<CairnCharacter> = charLens;
  const { npcId } = useUrlParams();
  if (npcId !== undefined) {
    const npcsLens = getSubLens(charLens, "hireLings");
    const npcLens = getSubArrayLensById(npcsLens, npcId);
    shoppingCharLens = npcLens;
  }

  return (
    <CurrentCharacterContextProvider value={shoppingCharLens}>
      <Shop />
    </CurrentCharacterContextProvider>
  );
}
