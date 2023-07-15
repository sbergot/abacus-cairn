import { createContext, useContext } from "react";

export interface IGameContext {
  gameName: string;
}

const GameContext = createContext<IGameContext>({ gameName: "unknown" });

export const GameContextProvider = GameContext.Provider;

export function useGameContext() {
  return useContext(GameContext);
}