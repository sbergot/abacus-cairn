import MainMenu from "@/components/generic-pages/main-menu";
import { Character } from "@/lib/game/cairn/types";
import { BaseGame } from "@/lib/game/types";

export default function CairnMainMenu() {
  return <MainMenu<Character, BaseGame<{}>> />
}