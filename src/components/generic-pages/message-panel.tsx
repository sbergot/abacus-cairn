import {
  AllChatMessage,
  AllCommonChatMessage,
  Stamped,
  UknownGameMessage,
} from "@/lib/network/types";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Children } from "../ui/types";
import { Card, CardContent, CardHeader } from "../ui/card";

type ContextType = "player" | "gm";

interface MessageContext {
  authorId: string;
  contextType: ContextType;
}

interface Props<TMessage> {
  messages: Stamped<AllChatMessage<TMessage>>[];
  authorId: string;
  context: MessageContext;
  ShowCustomMessage(props: { m: TMessage; ctx: MessageContext }): ReactNode;
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
      <div className="text-sm">
        <span className="text-mother-4">{stamp}</span> - {m.props.content}
      </div>
    );
  }
}

function ShowStampedMessage({
  m,
  children,
}: { m: Stamped<unknown> } & Children) {
  const stamp = `${m.author} - ${showLocalTime(m.time)}`;
  return (
    <Card>
      <CardHeader>{stamp}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}