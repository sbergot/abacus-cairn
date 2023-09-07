import { AllChatMessage, Stamped, UknownGameMessage } from "../network/types";
import { ILens } from "../types";

export interface LibraryElement {
  name: string;
  description: string;
  gauge?: Gauge;
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

export interface Timer extends WithId, GmContent {
  intervalInSec: number;
  currentTimeInMSec: number;
  isRecurring: boolean;
  isPublic: boolean;
  isPaused: boolean;
}



export interface Clock extends GmContent {
  gauge: Gauge;
}

export type CategoryType = "character" | "item" | "misc";

export interface BaseCategory<TType extends CategoryType, T> {
  id: string;
  type: TType;
  name: string;
  description: string;
  entries: (T & GmContent)[];
}

export type AnyCategory<TChar extends BaseCharacter, TItem> =
  | BaseCategory<"character", TChar>
  | BaseCategory<"item", TItem>
  | BaseCategory<"misc", {}>

export interface BaseGame<
  TCharacter extends BaseCharacter,
  TItem,
  TMessage,
  TCustomData
> {
  id: string;
  name: string;
  content: AnyCategory<TCharacter, TItem>[];
  messages: Stamped<AllChatMessage<TMessage>>[];
  timers: Timer[];
  clocks: Clock[];
  customData: TCustomData;
}

export type BaseGenericGame = BaseGame<BaseCharacter, {}, UknownGameMessage, {}>;

export interface CharacterProp<TChar> {
  characterLens: ILens<TChar>;
}
