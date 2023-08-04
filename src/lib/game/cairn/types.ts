import { ChatMessage } from "@/lib/network/types";

export interface Gauge {
  current: number;
  max: number;
}

export type AbilityType = "strength" | "dexterity" | "willpower";

export interface Character {
  id: string;
  name: string;
  age: number;
  background: string;
  traits: string[];
  strength: Gauge;
  dexterity: Gauge;
  willpower: Gauge;
  hp: Gauge;
  deprived: boolean;
  inventory: Slot[];
}

export type SlotType = "hand" | "body" | "backpack";

export interface Slot {
  id: string;
  type: SlotType;
  gear: Gear | null;
}

type BaseGearTag<T extends string, P> = { type: T } & P;

export type GearTag =
  | BaseGearTag<"bulky", {}>
  | BaseGearTag<"relic", { charges: Gauge }>
  | BaseGearTag<"weapon", { damage: number }>
  | BaseGearTag<"shield", { armor: number }>
  | BaseGearTag<"armor", { armor: number }>;

export interface Gear {
  id: string;
  name: string;
  tags: GearTag[];
  bulky: boolean;
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
