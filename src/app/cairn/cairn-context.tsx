import { Children } from "@/components/ui/types";
import {
  CairnCharacter,
  CairnGame,
  CairnMessage,
} from "@/lib/game/cairn/types";
import { createGameContext } from "@/lib/gameContext";
import { GmConnection, useGmConnection } from "@/lib/network/gmConnection";
import {
  PlayerConnection,
  usePlayerConnection,
  usePlayerConnectionStub,
} from "@/lib/network/playerConnection";
import { createContext, useContext } from "react";

export const {
  GameContextProvider,
  useGameContext,
  useCurrentCharacter,
  useCurrentGame,
} = createGameContext<CairnCharacter, CairnGame>("cairn");

const PlayerConnectionContext =
  createContext<PlayerConnection<CairnMessage> | null>(null);

export function PlayerConnectionStubContextProvider({ children }: Children) {
  return (
    <PlayerConnectionContext.Provider value={usePlayerConnectionStub()}>
      {children}
    </PlayerConnectionContext.Provider>
  );
}

interface PlayerConnectionContextProviderProps extends Children {
  sessionCode: string;
  character: CairnCharacter;
}

export function PlayerConnectionContextProvider({ sessionCode, character, children }: PlayerConnectionContextProviderProps) {
  return (
    <PlayerConnectionContext.Provider value={usePlayerConnection<CairnCharacter, CairnMessage>(sessionCode, character)}>
      {children}
    </PlayerConnectionContext.Provider>
  );
}

export function usePlayerConnectionContext() {
  return useContext(PlayerConnectionContext)!;
}

const GmConnectionContext = createContext<GmConnection<
  CairnMessage,
  CairnGame
> | null>(null);

export function useGmConnectionContext() {
  return useContext(GmConnectionContext)!;
}

export function GmConnectionContextProvider({ children }: Children) {
  return (
    <GmConnectionContext.Provider
      value={useGmConnection<CairnCharacter, CairnMessage, CairnGame>(() => [])}
    >
      {children}
    </GmConnectionContext.Provider>
  );
}
