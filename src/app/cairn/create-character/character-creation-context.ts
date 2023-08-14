import { CairnCharacter } from "@/lib/game/cairn/types"
import { Setter } from "@/lib/types";
import { createContext, useContext } from "react";

interface ICharacterCreationContext {
    character: CairnCharacter;
    setCharacter: Setter<CairnCharacter>;
}

const CharacterCreationContext = createContext<ICharacterCreationContext | null>(null);

export function useCharacterCreationContext() {
    return useContext(CharacterCreationContext)!;
}

export const CharacterCreationContextProvider = CharacterCreationContext.Provider;