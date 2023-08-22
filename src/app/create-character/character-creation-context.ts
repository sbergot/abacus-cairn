"use client"

import { CairnCharacter } from "@/lib/game/cairn/types"
import { ILens } from "@/lib/types";
import { createContext, useContext } from "react";

interface ICharacterCreationContext {
    lens: ILens<CairnCharacter>;
}

const CharacterCreationContext = createContext<ICharacterCreationContext | null>(null);

export function useCharacterCreationContext() {
    return useContext(CharacterCreationContext)!;
}

export const CharacterCreationContextProvider = CharacterCreationContext.Provider;