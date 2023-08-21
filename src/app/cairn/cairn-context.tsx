"use client";

import { Children } from "@/components/ui/types";
import {
  CairnCharacter,
  CairnGame,
  CairnMessage,
} from "@/lib/game/cairn/types";
import { LibraryElement } from "@/lib/game/types";
import { createGameContext } from "@/lib/gameContext";
import { GmConnection, useGmConnection } from "@/lib/network/gmConnection";
import {
  PlayerConnection,
  usePlayerConnection,
  usePlayerConnectionStub,
} from "@/lib/network/playerConnection";
import { Logger } from "@/lib/network/types";
import { createContext, useContext } from "react";

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
      <LoggerContext.Provider value={{ log: ctx.log }}>
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
      <LoggerContext.Provider value={{ log: ctx.log }}>
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
        category: e.category,
      }));
    }
  });

  const npcs = game.npcs.filter((e) => e.visibleToAll);
  if (npcs.length > 0) {
    result["npcs"] = npcs.map((e) => ({
      name: e.name,
      description: e.traits,
      category: "npcs",
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
      <LoggerContext.Provider value={{ log: ctx.log }}>
        {children}
      </LoggerContext.Provider>
    </GmConnectionContext.Provider>
  );
}
