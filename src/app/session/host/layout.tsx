"use client";

import {
  GmConnectionContextProvider,
  ShopItemsContextProvider,
  useCurrentGame,
} from "@/app/cairn-context";
import { TimerProvider } from "@/app/timer-provider";
import { Children } from "@/components/ui/types";
import { itemsByCategory } from "@/lib/game/cairn/items-data";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GmConnectionContextProvider>
      <TimerProvider>
        <GameShopItemsProvider>{children}</GameShopItemsProvider>
      </TimerProvider>
    </GmConnectionContextProvider>
  );
}

function GameShopItemsProvider({ children }: Children) {
  const { state } = useCurrentGame();
  return (
    <ShopItemsContextProvider
      value={state.customData.customItemsByCategory ?? itemsByCategory}
    >
      {children}
    </ShopItemsContextProvider>
  );
}
