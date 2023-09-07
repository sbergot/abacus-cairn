"use client";

import { Children } from "@/components/ui/types";
import {
  CairnCharacter,
  CairnCustomData,
  CairnGame,
  CairnMessage,
  Gear,
} from "@/lib/game/cairn/types";
import { LibraryElement } from "@/lib/game/types";
import { createGameContext } from "@/lib/game-context";
import { GmConnection, useGmConnection } from "@/lib/network/gmConnection";
import {
  PlayerConnection,
  usePlayerConnection,
  usePlayerConnectionStub,
} from "@/lib/network/playerConnection";
import { createContext, useContext } from "react";
import { itemsByCategory } from "@/lib/game/cairn/items-data";

export const {
  GameContextProvider,
  CurrentCharacterContextProvider,
  useGameContext,
  useCurrentCharacter,
  useCurrentGame,
  LoggerContextProvider,
  useLoggerContext,
  CustomDataContextProvider,
  useCustomDataContext,
} = createGameContext<CairnCharacter, CairnGame, CairnMessage, CairnCustomData>(
  "cairn",
  { customItemsByCategory: itemsByCategory }
);

const PlayerConnectionContext = createContext<PlayerConnection<
  CairnMessage,
  CairnCustomData
> | null>(null);

export function PlayerConnectionStubContextProvider({ children }: Children) {
  const ctx = usePlayerConnectionStub<CairnMessage, CairnCustomData>();
  return (
    <PlayerConnectionContext.Provider value={ctx}>
      <LoggerContextProvider value={ctx.log}>{children}</LoggerContextProvider>
    </PlayerConnectionContext.Provider>
  );
}

interface PlayerConnectionContextProviderProps extends Children {
  sessionCode: string;
  character: CairnCharacter;
}

export function PlayerConnectionContextProvider({
  sessionCode,
  character,
  children,
}: PlayerConnectionContextProviderProps) {
  const ctx = usePlayerConnection<
    CairnCharacter,
    CairnMessage,
    CairnCustomData
  >(sessionCode, character);
  return (
    <PlayerConnectionContext.Provider value={ctx}>
      <LoggerContextProvider value={ctx.log}>
        <CustomDataContextProvider
          value={ctx.customData ?? { customItemsByCategory: itemsByCategory }}
        >
          {children}
        </CustomDataContextProvider>
      </LoggerContextProvider>
    </PlayerConnectionContext.Provider>
  );
}

export function usePlayerConnectionContext() {
  return useContext(PlayerConnectionContext)!;
}

const GmConnectionContext = createContext<GmConnection<
  CairnMessage,
  CairnCharacter
> | null>(null);

export function useGmConnectionContext() {
  return useContext(GmConnectionContext)!;
}

function getAllRevealedElements(game: CairnGame) {
  const result: Record<string, LibraryElement[]> = {};
  game.content.map((category) => {
    const entries = category.entries.filter((e) => e.visibleToAll);
    if (entries.length > 0) {
      result[category.name] = entries.map((e) => ({
        name: e.name,
        description: e.description,
      }));
    }
  });

  const clocks = game.clocks.filter((e) => e.visibleToAll);
  if (clocks.length > 0) {
    result["clocks"] = clocks.map((e) => ({
      name: e.name,
      description: e.description,
      gauge: e.gauge,
    }));
  }

  const timers = game.timers.filter((e) => e.visibleToAll);
  if (timers.length > 0) {
    result["timers"] = timers.map((e) => ({
      name: e.name,
      description: e.description,
      gauge: { current: e.currentTimeInMSec, max: e.intervalInSec * 1000 },
    }));
  }

  return result;
}

export function GmConnectionContextProvider({ children }: Children) {
  const ctx = useGmConnection<
    CairnCharacter,
    CairnMessage,
    Gear,
    CairnGame,
    CairnCustomData
  >(getAllRevealedElements);
  return (
    <GmConnectionContext.Provider value={ctx}>
      <LoggerContextProvider value={ctx.log}>{children}</LoggerContextProvider>
    </GmConnectionContext.Provider>
  );
}
