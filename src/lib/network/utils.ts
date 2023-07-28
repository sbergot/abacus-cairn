import { useState } from "react";
import { AllChatMessage, Stamped } from "./types";

function getNow(): string {
  const now = new Date();
  return now.toISOString();
}

export function stamp<TMessage>(
  character: { id: string; name: string },
  m: TMessage
): Stamped<TMessage> {
  return {
    ...m,
    author: character.name,
    authorId: character.id,
    time: getNow(),
  };
}

export function useLog<TMessage>(author: string, authorId: string) {
  const [messages, setMessages] = useState<Stamped<AllChatMessage<TMessage>>[]>([]);

  function log(m: AllChatMessage<TMessage>) {
    setMessages((ms) => [...ms, stamp({ id: authorId, name: author }, m)]);
  }

  return { messages, log };
}
