"use client"

import {
  CurrentCharacterContextProvider,
  useCurrentGame,
  useGmConnectionContext,
} from "@/app/cairn-context";
import { Shop } from "@/components/cairn/shop";
import { ShowCairnMessage } from "@/components/cairn/show-cairn-message";
import { MessagePanel } from "@/components/generic-pages/message-panel";
import { TwoColumns } from "@/components/generic-pages/two-columns";
import { CairnMessage } from "@/lib/game/cairn/types";
import { getSubArrayLens, getSubLens } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const { messages } = useGmConnectionContext();
  return (
    <TwoColumns
      leftPart={<NpcShop />}
      rightPart={
        <MessagePanel<CairnMessage>
          context={{ contextType: "gm", authorId: "gm" }}
          messages={messages}
          ShowCustomMessage={ShowCairnMessage}
        />
      }
    />
  );
}

function NpcShop() {
  const gameLens = useCurrentGame();
  const searchParams = useSearchParams();
  const npcId = searchParams.get("npcId");
  const npcsLens = getSubLens(gameLens, "npcs");
  const idx = npcsLens.state.findIndex((n) => n.id === npcId);
  const npcLens = getSubArrayLens(npcsLens, idx);

  return (
    <CurrentCharacterContextProvider value={npcLens}>
      <Shop />
    </CurrentCharacterContextProvider>
  );
}
