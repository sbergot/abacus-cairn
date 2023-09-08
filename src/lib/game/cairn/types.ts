import { ChatMessage } from "@/lib/network/types";
import { BaseGame, Gauge, GmContent } from "../types";
import { DicePool, DiceRollAnalysis } from "@/lib/dice/types";

export type AbilityType = "strength" | "dexterity" | "willpower";

export interface CairnCharacterBase {
  id: string;
  name: string;
  age: number;
  background: string;
  description: string;
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

export interface CarryCapacity {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: Slot[];
}

export interface CairnCharacter extends CairnCharacterBase {
  hireLings: CairnCharacter[];
  carryCapacities: CarryCapacity[];
}

export interface CairnNpc extends CairnCharacter, GmContent {}

export interface GearContent extends Gear, GmContent {}

type TaggedUnion<T extends string, P> = { type: T } & P;

export type SlotType = string;

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
  description: string;
  bulky?: boolean;
  blast?: boolean;
  charges?: Gauge;
  price?: number;
  damage?: number;
  damageDiceNbr?: number;
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
  dice: DicePool;
  result: DiceRollAnalysis;
}

export type CairnMessage =
  | ChatMessage<"Scarred", {}>
  | ChatMessage<"NpcShare", { npc: CairnCharacter }>
  | ChatMessage<"ItemShare", { item: Gear }>
  | ChatMessage<"AbilityRoll", AbilityRollAnalysis>
  | ChatMessage<"AttackRoll", AttackRollResult>;

export interface CairnCustomData {
  customItemsByCategory?: Record<string, Gear[]>;
}

export interface CairnGame
  extends BaseGame<CairnCharacter, Gear, CairnMessage, CairnCustomData> {
}

export type ShopItems = Record<string, Gear[]>;
