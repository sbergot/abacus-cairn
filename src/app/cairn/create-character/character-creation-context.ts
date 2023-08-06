import { Setter } from "@/components/ui/types";
import { Character } from "@/lib/game/cairn/types"
import { createContext, useContext } from "react";

interface ICharacterCreationContext {
    character: Character;
    setCharacter: Setter<Character>;
}

const CharacterCreationContext = createContext<ICharacterCreationContext | null>(null);

export function useCharacterCreationContext() {
    return useContext(CharacterCreationContext)!;
}

export const CharacterCreationContextProvider = CharacterCreationContext.Provider;