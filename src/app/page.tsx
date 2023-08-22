"use client"

import MainMenu from "@/components/generic-pages/main-menu";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { BaseGame } from "@/lib/game/types";

export default function CairnMainMenu() {
  return <MainMenu<CairnCharacter, BaseGame<{}>> />
}