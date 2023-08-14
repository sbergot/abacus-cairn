import { createContext, useContext } from "react";
import { BaseCharacter, BaseGame } from "./game/types";
import { Children } from "@/components/ui/types";
import { useImmerLocalStorage } from "./hooks";
import { ILens } from "./types";
import { useParams } from "next/navigation";
import { setSingle } from "./utils";
import { UknownGameMessage } from "./network/types";

export interface IGameContext<
  TChar extends BaseCharacter,
  TGame extends BaseGame<UknownGameMessage>
> {
  characterRepo: ILens<Record<string, TChar>>;
  gameRepo: ILens<Record<string, TGame>>;
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

export function useCurrentGenericCharacter(): ILens<BaseCharacter> {
  const {
    characterRepo: { state, setState },
  } = useGenericGameContext();
  const params = useParams();
  const { characterId } = params;
  const character = state[characterId];
  const setCharacter = setSingle(setState, characterId);
  return { state: character, setState: setCharacter };
}

export function useCurrentGenericGame(): ILens<BaseGame<UknownGameMessage>> {
  const {
    gameRepo: { state, setState },
  } = useGenericGameContext();
  const params = useParams();
  const { gameId } = params;
  const game = state[gameId];
  const setGame = setSingle(setState, gameId);
  return { state: game, setState: setGame };
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

  function useCurrentCharacter(): ILens<TChar> {
    const {
      characterRepo: { state, setState },
    } = useGameContext();
    const params = useParams();
    const { characterId } = params;
    const character = state[characterId];
    const setCharacter = setSingle(setState, characterId);
    return { state: character, setState: setCharacter };
  }

  function useCurrentGame(): ILens<TGame> {
    const {
      gameRepo: { state, setState },
    } = useGameContext();
    const params = useParams();
    const { gameId } = params;
    const game = state[gameId];
    const setGame = setSingle(setState, gameId);
    return { state: game, setState: setGame };
  }

  return {
    GameContextProvider,
    useGameContext,
    useCurrentCharacter,
    useCurrentGame,
  };
}
