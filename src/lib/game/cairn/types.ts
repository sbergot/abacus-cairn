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

export type SlotType = "hand" | "body" | "backpack";

export interface Slot {
  id: string;
  type: SlotType;
  gear: Gear | null;
}

type BaseGearTag<T extends string, P> = { type: T } & P;

export type GearTag =
  | BaseGearTag<"bulky", {}>
  | BaseGearTag<"blast", {}>
  | BaseGearTag<"relic", { charges: Gauge }>
  | BaseGearTag<"price", { price: number }>
  | BaseGearTag<"weapon", { damage: number }>
  | BaseGearTag<"shield", { armor: number }>
  | BaseGearTag<"armor", { armor: number }>;

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

export interface CairnGame extends BaseGame<CairnMessage> {

}