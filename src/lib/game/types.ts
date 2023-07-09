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
  excluded: boolean;
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
  title: string;
  customEntries: CustomEntry[];
  messages: Stamped<AllChatMessage<TMessage>>[];
  timers: Timer[];
}