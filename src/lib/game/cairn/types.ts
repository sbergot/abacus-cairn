import { ChatMessage } from "@/lib/network/types";
import { BaseGame } from "../types";

export interface Gauge {
  current: number;
  max: number;
}

export type AbilityType = "strength" | "dexterity" | "willpower";

export interface CairnCharacter {
  id: string;
  name: string;
  age: number;
  background: string;
  traits: string[];
  strength: Gauge;
  dexterity: Gauge;
  willpower: Gauge;
  hp: Gauge;
  gold: number;
  silver: number;
  copper: number;
  deprived: boolean;
  inventory: Slot[];
}

type TaggedUnion<T extends string, P> = { type: T } & P;

export type SlotType = "hand" | "body" | "backpack";

export type SlotState =
  | TaggedUnion<"empty", {}>
  | TaggedUnion<"fatigue", {}>
  | TaggedUnion<"bulky", { slotId: string; name: string }>
  | TaggedUnion<"gear", { gear: Gear }>;

export interface Slot {
  id: string;
  type: SlotType;
  state: SlotState;
}

export interface Gear {
  id: string;
  name: string;
  bulky?: boolean;
  blast?: boolean;
  charges?: Gauge;
  price?: number;
  damage?: number;
  armor?: number;
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

export interface AttackRollResult {
  result: number;
}

export type CairnMessage =
  | ChatMessage<"AbilityRoll", AbilityRollAnalysis>
  | ChatMessage<"AttackRoll", AttackRollResult>;

export interface CairnGame extends BaseGame<CairnMessage> {}
