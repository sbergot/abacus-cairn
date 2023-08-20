import { AllChatMessage, Stamped } from "../network/types";

export interface LibraryElement {
  name: string;
  description: string;
  category: string;
}

export interface WithId {
  id: string;
}

export interface BaseCharacter extends WithId {
  name: string;
}

export interface CustomEntry extends WithId {
  name: string;
  category: string;
  description: string;
  visibleToAll: boolean;
  excludedFromRandomPick: boolean;
}

export interface Timer extends WithId {
  title: string;
  intervalInSec: number;
  currentTimeInMSec: number;
  isRecurring: boolean;
  isPublic: boolean;
  isPaused: boolean;
}

export interface BaseGame<TMessage> {
  id: string;
  title: string;
  customEntries: Record<string, CustomEntry[]>;
  messages: Stamped<AllChatMessage<TMessage>>[];
  timers: Timer[];
}