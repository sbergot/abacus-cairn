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
  kind: "chat";
  transient?: boolean;
  wardenOnly?: boolean;
}

export interface SyncMessage<T extends string, P, D extends "GM" | "Player">
  extends BaseMessage<T, P> {
  kind: "sync";
  destination: D;
}

export type UknownGameMessage = ChatMessage<string, unknown>;

export type AllSyncMessageForGM<TChar> =
  | SyncMessage<"UpdateChar", { character: TChar }, "GM">
  | SyncMessage<"RevealedElementsRequest", {}, "GM">
  | SyncMessage<"MessageHistoryRequest", {}, "GM">;

export type AllSyncMessageForPlayer<TMessage> =
  | SyncMessage<
      "RevealedElementsResponse",
      { revealedElements: LibraryElement[] },
      "Player"
    >
  | SyncMessage<
      "MessageHistoryResponse",
      { messages: Stamped<TMessage>[] },
      "Player"
    >;

export type AllSyncMessage<TChar, TMessage> =
  | AllSyncMessageForGM<TChar>
  | AllSyncMessageForPlayer<TMessage>;

export type AllChatMessage<TMessage> = ChatMessage<"SimpleMessage", { content: string }> | TMessage; 

export type AnyMessage<TChar, TMessage> =
  | AllSyncMessage<TChar, TMessage>
  | Stamped<AllChatMessage<TMessage>>;

export interface LibraryElement {
  name: string;
  description: string;
  category: string;
}

export interface BaseCharacter {
  id: string;
  name: string;
}
