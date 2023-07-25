import { createContext, useContext } from "react";
import { BaseCharacter } from "./game/types";
import { Draft } from "immer";
import { Children } from "@/components/ui/types";
import { useImmerLocalStorage } from "./hooks";

export interface IGameContext<TChar extends BaseCharacter> {
  gameName: string;
  characters: Record<string, TChar>;
  setCharacters(r: (d: Draft<Record<string, TChar>>) => void): void;
}

const GenericGameContext = createContext<IGameContext<BaseCharacter> | null>(
  null
);

const GenericGameContextProvider = GenericGameContext.Provider;

export function useGenericGameContext() {
  return useContext(GenericGameContext)!;
}

export function createGameContext<TChar extends BaseCharacter>(
  gameName: string
) {
  const GameContext = createContext<IGameContext<TChar> | null>(null);
  const { Provider } = GameContext;

  function GameContextProvider({ children }: Children) {
    const [characters, setCharacters] = useImmerLocalStorage<
      Record<string, TChar>
    >(`${gameName}-characters`, {});

    return (
      <GenericGameContextProvider
        value={{ gameName, characters, setCharacters }}
      >
        <Provider value={{ gameName, characters, setCharacters }}>
          {children}
        </Provider>
      </GenericGameContextProvider>
    );
  }

  function useGameContext() {
    return useContext(GameContext)!;
  }

  return { GameContextProvider, useGameContext };
}
