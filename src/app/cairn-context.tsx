"use client";

import { Children } from "@/components/ui/types";
import {
  CairnCharacter,
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
import { Logger } from "@/lib/network/types";
import { createContext, useContext } from "react";
import { itemsByCategory } from "@/lib/game/cairn/items-data";

type ShopItems = Record<string, Gear[]>;

const ShopItemsContext = createContext<ShopItems>(itemsByCategory);

export function useShopItemsContext() {
  return useContext(ShopItemsContext);
}

const LoggerContext = createContext<Logger<CairnMessage> | null>(null);

export function useLoggerContext() {
  return useContext(LoggerContext)!;
}

export const {
  GameContextProvider,
  CurrentCharacterContextProvider,
  useGameContext,
  useCurrentCharacter,
  useCurrentGame,
} = createGameContext<CairnCharacter, CairnGame>("cairn");

const PlayerConnectionContext =
  createContext<PlayerConnection<CairnMessage> | null>(null);

export function PlayerConnectionStubContextProvider({ children }: Children) {
  const ctx = usePlayerConnectionStub<CairnMessage>();
  return (
    <PlayerConnectionContext.Provider value={ctx}>
      <LoggerContext.Provider value={ctx.log}>
        {children}
      </LoggerContext.Provider>
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
  const ctx = usePlayerConnection<CairnCharacter, CairnMessage>(
    sessionCode,
    character
  );
  return (
    <PlayerConnectionContext.Provider value={ctx}>
      <LoggerContext.Provider value={ctx.log}>
        {children}
      </LoggerContext.Provider>
    </PlayerConnectionContext.Provider>
  );
}

export function usePlayerConnectionContext() {
  return useContext(PlayerConnectionContext)!;
}

const GmConnectionContext = createContext<GmConnection<
  CairnMessage,
  CairnGame,
  CairnCharacter
> | null>(null);

export function useGmConnectionContext() {
  return useContext(GmConnectionContext)!;
}

function getAllRevealedElements(game: CairnGame) {
  const result: Record<string, LibraryElement[]> = {};
  Object.keys(game.customEntries).map((k) => {
    const entries = game.customEntries[k].filter((e) => e.visibleToAll);
    if (entries.length > 0) {
      result[k] = entries.map((e) => ({
        name: e.name,
        description: e.description,
      }));
    }
  });

  const npcs = game.npcs.filter((e) => e.visibleToAll);
  if (npcs.length > 0) {
    result["npcs"] = npcs.map((e) => ({
      name: e.name,
      description: e.description,
    }));
  }

  const items = game.items.filter((e) => e.visibleToAll);
  if (items.length > 0) {
    result["items"] = items.map((e) => ({
      name: e.name,
      description: e.description,
    }));
  }

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
  const ctx = useGmConnection<CairnCharacter, CairnMessage, CairnGame>(
    getAllRevealedElements
  );
  return (
    <GmConnectionContext.Provider value={ctx}>
      <LoggerContext.Provider value={ctx.log}>
        {children}
      </LoggerContext.Provider>
    </GmConnectionContext.Provider>
  );
}
