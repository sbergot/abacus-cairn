import { Children } from "@/components/ui/types";
import { Character, Message } from "@/lib/game/cairn/types";
import { createGameContext } from "@/lib/gameContext";
import {
  PlayerConnection,
  usePlayerConnectionStub,
} from "@/lib/network/playerConnection";
import { createContext, useContext } from "react";

export const { GameContextProvider, useGameContext, useCharacterStorage } =
  createGameContext<Character>("cairn");

const PlayerConnectionContext = createContext<PlayerConnection<Message> | null>(
  null
);

export function PlayerConnectionContextProvider({ children }: Children) {
  return (
    <PlayerConnectionContext.Provider value={usePlayerConnectionStub()}>
      {children}
    </PlayerConnectionContext.Provider>
  );
}

export function usePlayerConnectionContext() {
  return useContext(PlayerConnectionContext)!;
}
