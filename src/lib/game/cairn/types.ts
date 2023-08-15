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
  | TaggedUnion<"bulky", { slotId: string, name: string }>
  | TaggedUnion<"gear", { gear: Gear }>;

export interface Slot {
  id: string;
  type: SlotType;
  state: SlotState;
}

export type GearTag =
  | TaggedUnion<"bulky", {}>
  | TaggedUnion<"blast", {}>
  | TaggedUnion<"relic", { charges: Gauge }>
  | TaggedUnion<"price", { price: number }>
  | TaggedUnion<"weapon", { damage: number }>
  | TaggedUnion<"shield", { armor: number }>
  | TaggedUnion<"armor", { armor: number }>;

export interface Gear {
  id: string;
  name: string;
  tags: GearTag[];
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

export type CairnMessage = ChatMessage<"AbilityRoll", AbilityRollAnalysis>;

export interface CairnGame extends BaseGame<CairnMessage> {}
