import { LibraryElement } from "../game/types";

export type Stamped<T> = T & {
  authorId: string;
  author: string;
  time: string;
};

export interface BaseMessage<T extends string, P> {
  type: T;
  props: P;
}

export interface ChatMessage<T extends string, P> extends BaseMessage<T, P> {
  /** message will not be stored between sessions */
  transient?: boolean;
  /** message will only be shown to the gm */
  gmOnly?: boolean;
  title?: string;
}

export type UknownGameMessage = ChatMessage<string, unknown>;

export interface SyncMessage<T extends string, P> extends BaseMessage<T, P> {}


export type AllSyncMessageForGM<TChar> =
  | SyncMessage<"UpdateChar", { character: TChar }>
  | SyncMessage<"CustomDataRequest", {}>
  | SyncMessage<"RevealedElementsRequest", {}>
  | SyncMessage<"MessageHistoryRequest", {}>;

export type AllSyncMessageForPlayer<TMessage, TCustomData> =
  | SyncMessage<
      "CustomDataResponse",
      { customData: TCustomData }
    >
  | SyncMessage<
      "RevealedElementsResponse",
      { revealedElements: Record<string, LibraryElement[]> }
    >
  | SyncMessage<
      "MessageHistoryResponse",
      { messages: Stamped<AllChatMessage<TMessage>>[] }
    >;

export type AllSyncMessage<TChar, TMessage, TCustomData> =
  | ({ destination: "GM" } & AllSyncMessageForGM<TChar>)
  | ({ destination: "Player" } & AllSyncMessageForPlayer<TMessage, TCustomData>);

export type AllCommonChatMessage =
  | ChatMessage<"SimpleMessage", { content: string }>
  | ChatMessage<"BasicMessage", { content: string }>;

export type AllChatMessage<TMessage> =
  | ({ kind: "chat-common" } & AllCommonChatMessage)
  | ({ kind: "chat-custom" } & TMessage);

export type AnyMessage<TChar, TMessage, TCustomData> =
  | ({ kind: "sync" } & AllSyncMessage<TChar, TMessage, TCustomData>)
  | Stamped<AllChatMessage<TMessage>>;

export interface ConnectionMetadata {
  browserId: string;
}

export type Logger<TMessage> = (m: AllChatMessage<TMessage>) => void;
