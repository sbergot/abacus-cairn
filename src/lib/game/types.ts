import { AllChatMessage, Stamped } from "../network/types";
import { ILens } from "../types";

export interface LibraryElement {
  name: string;
  description: string;
}

export interface WithId {
  id: string;
}

export interface Gauge {
  current: number;
  max: number;
}

export interface BaseCharacter extends WithId {
  name: string;
}

export interface GmContent {
  id: string;
  name: string;
  description: string;
  visibleToAll: boolean;
  excludedFromRandomPick: boolean;
  privateNotes: string;
}

export interface CustomEntry extends WithId, GmContent {}

export interface Timer extends WithId {
  name: string;
  description: string;
  intervalInSec: number;
  currentTimeInMSec: number;
  isRecurring: boolean;
  isPublic: boolean;
  isPaused: boolean;
}

export interface Clock extends GmContent {
  gauge: Gauge;
}

export interface BaseGame<TMessage> {
  id: string;
  title: string;
  customEntries: Record<string, CustomEntry[]>;
  messages: Stamped<AllChatMessage<TMessage>>[];
  timers: Timer[];
  clocks: Clock[];
}

export interface CharacterProp<TChar> {
  characterLens: ILens<TChar>;
}
