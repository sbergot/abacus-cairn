import { createContext, useContext } from "react";
import { BaseCharacter, BaseGenericGame } from "./game/types";
import { Children } from "@/components/ui/types";
import { useImmerLocalStorage, useUrlParams } from "./hooks";
import { ILens } from "./types";
import { setSingle } from "./utils";
import { Logger } from "./network/types";

export interface IGameContext<
  TChar extends BaseCharacter,
  TGame extends BaseGenericGame
> {
  characterRepo: ILens<Record<string, TChar>>;
  gameRepo: ILens<Record<string, TGame>>;
  gameName: string;
}

// generic context for generic UI (game menu, session layout etc)
const GenericGameContext = createContext<IGameContext<
  BaseCharacter,
  BaseGenericGame
> | null>(null);

const GenericGameContextProvider = GenericGameContext.Provider;

export function useGenericGameContext() {
  return useContext(GenericGameContext)!;
}

export function useCurrentGenericCharacter(): ILens<BaseCharacter> {
  const {
    characterRepo: { state, setState },
  } = useGenericGameContext();
  const params = useUrlParams();
  const { characterId } = params;
  const character = state[characterId];
  const setCharacter = setSingle(setState, characterId);
  return { state: character, setState: setCharacter };
}

export function useCurrentGenericGame(): ILens<BaseGenericGame> {
  const {
    gameRepo: { state, setState },
  } = useGenericGameContext();
  const params = useUrlParams();
  const { gameId } = params;
  const game = state[gameId];
  const setGame = setSingle(setState, gameId);
  return { state: game, setState: setGame };
}

export function createGameContext<
  TChar extends BaseCharacter,
  TGame extends BaseGenericGame,
  TMessage,
  TCustomData
>(gameName: string, defaultCustomData: TCustomData) {
  // typesafe context for game specific UI
  const GameContext = createContext<IGameContext<TChar, TGame> | null>(null);

  const CustomDataContext = createContext<TCustomData>(defaultCustomData);

  const CustomDataContextProvider = CustomDataContext.Provider;

  function useCustomDataContext() {
    return useContext(CustomDataContext)!;
  }

  const LoggerContext = createContext<Logger<TMessage> | null>(null);

  const LoggerContextProvider = LoggerContext.Provider;

  function useLoggerContext() {
    return useContext(LoggerContext)!;
  }

  const CurrentCharacterContext = createContext<ILens<TChar> | null>(null);
  function CurrentCharacterFromParamsContextProvider({ children }: Children) {
    const {
      characterRepo: { state, setState },
    } = useGameContext();
    const params = useUrlParams();
    const { characterId } = params;
    const character = state[characterId];
    const setCharacter = setSingle(setState, characterId);
    const currentCharacterLens: ILens<TChar> = {
      state: character,
      setState: setCharacter,
    };
    return (
      <CurrentCharacterContext.Provider value={currentCharacterLens}>
        {children}
      </CurrentCharacterContext.Provider>
    );
  }

  function useCurrentCharacter() {
    return useContext(CurrentCharacterContext)!;
  }

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
      <GenericGameContextProvider
        value={context as any as IGameContext<BaseCharacter, BaseGenericGame>}
      >
        <GameContext.Provider value={context}>
          <CurrentCharacterFromParamsContextProvider>
            {children}
          </CurrentCharacterFromParamsContextProvider>
        </GameContext.Provider>
      </GenericGameContextProvider>
    );
  }

  function useGameContext() {
    return useContext(GameContext)!;
  }

  function useCurrentGame(): ILens<TGame> {
    const {
      gameRepo: { state, setState },
    } = useGameContext();
    const params = useUrlParams();
    const { gameId } = params;
    const game = state[gameId];
    const setGame = setSingle(setState, gameId);
    return { state: game, setState: setGame };
  }

  return {
    GameContextProvider,
    CurrentCharacterContextProvider: CurrentCharacterContext.Provider,
    useGameContext,
    useCurrentCharacter,
    useCurrentGame,
    CustomDataContextProvider,
    useCustomDataContext,
    LoggerContextProvider,
    useLoggerContext,
  };
}
