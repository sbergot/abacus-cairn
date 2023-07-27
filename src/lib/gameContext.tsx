import { createContext, useContext } from "react";
import { BaseCharacter } from "./game/types";
import { Children } from "@/components/ui/types";
import { useImmerLocalStorage } from "./hooks";
import { IUseStateContext } from "./types";
import { useParams } from "next/navigation";
import { setSingle } from "./utils";

export interface IGameContext<TChar extends BaseCharacter> {
  characterRepo: IUseStateContext<Record<string, TChar>>;
  gameName: string;
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
        value={{
          gameName,
          characterRepo: { state: characters, setState: setCharacters },
        }}
      >
        <Provider
          value={{
            gameName,
            characterRepo: { state: characters, setState: setCharacters },
          }}
        >
          {children}
        </Provider>
      </GenericGameContextProvider>
    );
  }

  function useGameContext() {
    return useContext(GameContext)!;
  }

  function useCharacterStorage() {
    const { characterRepo: { state, setState } } = useGameContext();
    const params = useParams();
    const { characterId } = params;
    const character = state[characterId];
    const setCharacter = setSingle(setState, characterId);
    return { character, setCharacter }
  }

  return { GameContextProvider, useGameContext, useCharacterStorage };
}
