import { AllChatMessage, Stamped, UknownGameMessage } from "@/lib/network/types";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

type ContextType = "player" | "gm";

interface Props<TMessage> {
  messages: Stamped<AllChatMessage<TMessage>>[];
  authorId: string;
  contextType: ContextType;
}

function showLocalTime(t: string): string {
  const date = new Date(t);
  return date.toLocaleString();
}

export function MessagePanel<TMessage extends UknownGameMessage>({
  messages,
  authorId,
  contextType,
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
            const stamp = `${m.author} - ${showLocalTime(m.time)}`;
            return m.type === "SimpleMessage" && typeof m.props === "string" ? (
              <div key={i} className="text-sm">
                <span className="text-mother-4">{stamp}</span> -{" "}
                {m.props}
              </div>
            ) : (
              <Block key={i} variant="light">
                <div>
                  <div className="text-sm text-mother-4">{stamp}</div>
                  <ShowMessage message={m} context={context} />
                </div>
              </Block>
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
