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

export interface SyncMessage<T extends string, P> extends BaseMessage<T, P> {}

export type UknownGameMessage = ChatMessage<string, unknown>;

export type AllSyncMessageForGM<TChar> =
  | SyncMessage<"UpdateChar", { character: TChar }>
  | SyncMessage<"RevealedElementsRequest", {}>
  | SyncMessage<"MessageHistoryRequest", {}>;

export type AllSyncMessageForPlayer<TMessage> =
  | SyncMessage<
      "RevealedElementsResponse",
      { revealedElements: LibraryElement[] }
    >
  | SyncMessage<
      "MessageHistoryResponse",
      { messages: Stamped<AllChatMessage<TMessage>>[] }
    >;

export type AllSyncMessage<TChar, TMessage> =
  | ({ destination: "GM" } & AllSyncMessageForGM<TChar>)
  | ({ destination: "Player" } & AllSyncMessageForPlayer<TMessage>);

export type AllCommonChatMessage =
  | ChatMessage<"SimpleMessage", { content: string }>
  | ChatMessage<"BasicMessage", { content: string }>;

export type AllChatMessage<TMessage> =
  | ({ kind: "chat-common" } & AllCommonChatMessage)
  | ({ kind: "chat-custom" } & TMessage);

export type AnyMessage<TChar, TMessage> =
  | ({ kind: "sync" } & AllSyncMessage<TChar, TMessage>)
  | Stamped<AllChatMessage<TMessage>>;

export interface ConnectionMetadata {
  browserId: string;
}

export interface Logger<TMessage> {
  log: (m: AllChatMessage<TMessage>) => void;
}