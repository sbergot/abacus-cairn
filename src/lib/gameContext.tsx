import { createContext, useContext } from "react";
import { BaseCharacter, BaseGame } from "./game/types";
import { Children } from "@/components/ui/types";
import { useImmerLocalStorage } from "./hooks";
import { IUseStateContext } from "./types";
import { useParams } from "next/navigation";
import { setSingle } from "./utils";
import { UknownGameMessage } from "./network/types";

export interface IGameContext<
  TChar extends BaseCharacter,
  TGame extends BaseGame<UknownGameMessage>
> {
  characterRepo: IUseStateContext<Record<string, TChar>>;
  gameRepo: IUseStateContext<Record<string, TGame>>;
  gameName: string;
}

// generic context for generic UI (game menu, session layout etc)
const GenericGameContext = createContext<IGameContext<
  BaseCharacter,
  BaseGame<UknownGameMessage>
> | null>(null);

const GenericGameContextProvider = GenericGameContext.Provider;

export function useGenericGameContext() {
  return useContext(GenericGameContext)!;
}

export function createGameContext<
  TChar extends BaseCharacter,
  TGame extends BaseGame<UknownGameMessage>
>(gameName: string) {
  // typesafe context for game specific UI
  const GameContext = createContext<IGameContext<TChar, TGame> | null>(null);
  const { Provider } = GameContext;

  function GameContextProvider({ children }: Children) {
    const [characters, setCharacters] = useImmerLocalStorage<
      Record<string, TChar>
    >(`${gameName}-characters`, {});

    const [games, setGames] = useImmerLocalStorage<Record<string, TGame>>(
      `${gameName}-games`,
      {}
    );

    const context: IGameContext<TChar, TGame> = {
      gameName,
      characterRepo: { state: characters, setState: setCharacters },
      gameRepo: { state: games, setState: setGames },
    };

    return (
      <GenericGameContextProvider value={context}>
        <Provider value={context}>{children}</Provider>
      </GenericGameContextProvider>
    );
  }

  function useGameContext() {
    return useContext(GameContext)!;
  }

  function useCharacterStorage() {
    const {
      characterRepo: { state, setState },
    } = useGameContext();
    const params = useParams();
    const { characterId } = params;
    const character = state[characterId];
    const setCharacter = setSingle(setState, characterId);
    return { character, setCharacter };
  }

  return { GameContextProvider, useGameContext, useCharacterStorage };
}
