import { Character } from "@/lib/game/cairn/types";
import { createGameContext } from "@/lib/gameContext";

export const { GameContextProvider, useGameContext, useCharacterStorage } = createGameContext<Character>("cairn");
