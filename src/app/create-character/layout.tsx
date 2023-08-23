"use client"

import { Children } from "@/components/ui/types";
import { initBlankCharacter } from "@/lib/game/cairn/character-generation";
import { CairnCharacter } from "@/lib/game/cairn/types"
import { useImmer } from "use-immer";
import { CharacterCreationContextProvider } from "./character-creation-context";

export default function Layout({ children }: Children) {
    const [state, setState] = useImmer<CairnCharacter>(initBlankCharacter());

    return <CharacterCreationContextProvider value={{ lens: { state, setState }}}>
        {children}
    </CharacterCreationContextProvider>
}