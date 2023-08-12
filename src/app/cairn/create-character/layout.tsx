"use client"

import { Children } from "@/components/ui/types";
import { initCharacter } from "@/lib/game/cairn/character-generation";
import { CairnCharacter } from "@/lib/game/cairn/types"
import { useImmer } from "use-immer";
import { CharacterCreationContextProvider } from "./character-creation-context";

export default function Layout({ children }: Children) {
    const [character, setCharacter] = useImmer<CairnCharacter>(initCharacter());

    return <CharacterCreationContextProvider value={{ character, setCharacter }}>
        {children}
    </CharacterCreationContextProvider>
}