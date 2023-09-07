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
import { CairnCharacter, CairnMessage } from "@/lib/game/cairn/types";
import { BaseCategory, BaseGenericGame } from "@/lib/game/types";
import { useUrlParams } from "@/lib/hooks";
import { ILens } from "@/lib/types";
import { getSubArrayLensById, getSubLens } from "@/lib/utils";

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

function findNpcCategory(game: BaseGenericGame, npcId: string): BaseCategory<"character", CairnCharacter> {
  const result = game.content.filter(category => category.type === "character").find(category => category.entries.some(e => e.id === npcId));
  if (result === undefined) {
    throw new Error("npc id not found");
  }
  return result as BaseCategory<"character", CairnCharacter>;
}

function NpcShop() {
  const gameLens = useCurrentGame();
  const { npcId } = useUrlParams();
  const category = findNpcCategory(gameLens.state, npcId);
  const contentLens = getSubLens(gameLens, "content");
  const categoryLens = getSubArrayLensById(contentLens, category.id);
  const entriesLens = getSubLens(categoryLens, "entries");
  const npcLens = getSubArrayLensById(entriesLens, npcId);

  return (
    <CurrentCharacterContextProvider value={npcLens as any as ILens<CairnCharacter>}>
      <Shop />
    </CurrentCharacterContextProvider>
  );
}
