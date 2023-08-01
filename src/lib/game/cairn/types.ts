import { ChatMessage } from "@/lib/network/types";

export interface Ability {
  current: number;
  max: number;
}

export type AbilityType = "strength" | "dexterity" | "willpower";

export interface Character {
  id: string;
  name: string;
  background: string;
  strength: Ability;
  dexterity: Ability;
  willpower: Ability;
  hp: Ability;
}

export type RollMode = "normal" | "advantage" | "disadvantage";

export interface AbilityCheck {
  abilityName: AbilityType;
  abilityValue: number;
  mode: RollMode;
}

export interface AbilityRollAnalysis {
  check: AbilityCheck;
  results: DiceRollAnalysis;
  isSuccess: boolean;
}

export type Message = ChatMessage<"AbilityRoll", AbilityRollAnalysis>;
