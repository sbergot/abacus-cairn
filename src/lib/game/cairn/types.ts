import { UknownGameMessage } from "@/lib/network/types";

export interface Ability {
  current: number;
  max: number;
}

export interface Character {
  id: string;
  name: string;
  background: string;
  strength: Ability;
  dexterity: Ability;
  willpower: Ability;
  hp: Ability;
}

export type Message = UknownGameMessage;