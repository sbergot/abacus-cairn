"use client";

import {
  AllChatMessage,
  AllCommonChatMessage,
  Stamped,
  UknownGameMessage,
} from "@/lib/network/types";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Children } from "../ui/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WeakEmph } from "../ui/typography";

type ContextType = "player" | "gm";

export interface MessageContext {
  authorId: string;
  contextType: ContextType;
}

export interface ShowCustomMessageProps<TMessage> {
  m: TMessage;
  ctx: MessageContext;
}

interface Props<TMessage> {
  messages: Stamped<AllChatMessage<TMessage>>[];
  context: MessageContext;
  ShowCustomMessage(props: ShowCustomMessageProps<TMessage>): ReactNode;
}

function showLocalTime(t: string): string {
  const date = new Date(t);
  return date.toLocaleString();
}

export function MessagePanel<TMessage extends UknownGameMessage>({
  messages,
  context,
  ShowCustomMessage,
}: Props<TMessage>) {
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const [clearTime, setClearTime] = useState<Date>(new Date(0));

  useEffect(() => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [messages]);

  return (
    <div className="h-full">
      <div className="overflow-auto flex flex-col gap-2 h-full border-2 rounded-3xl p-4 mb-2 border-mother-5 bg-white">
        {messages
          .filter((m) => new Date(m.time) > clearTime)
          .map((m, i) => {
            return m.kind === "chat-common" ? (
              <ShowCommonMessage key={i} m={m} />
            ) : (
              <ShowStampedMessage key={i} m={m}>
                <ShowCustomMessage m={m} ctx={context} />
              </ShowStampedMessage>
            );
          })}
        <Button variant="secondary" onClick={() => setClearTime(new Date())}>
          clear messages
        </Button>
        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>
    </div>
  );
}

function ShowCommonMessage({ m }: { m: Stamped<AllCommonChatMessage> }) {
  const stamp = `${m.author} - ${showLocalTime(m.time)}`;
  if (m.type === "SimpleMessage") {
    return (
      <WeakEmph>
        {stamp} - {m.props.content}
      </WeakEmph>
    );
  }

  if (m.type === "BasicMessage") {
    return <ShowStampedMessage m={m}>{m.props.content}</ShowStampedMessage>;
  }
}

function ShowStampedMessage({
  m,
  children,
}: { m: Stamped<UknownGameMessage> } & Children) {
  const stamp = `${m.author} - ${showLocalTime(m.time)}`;
  return (
    <Card>
      <CardHeader className="pb-2">
        <WeakEmph>{stamp}</WeakEmph>
        {m.title && <CardTitle>{m.title}</CardTitle>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
