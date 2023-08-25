import {
  Stamped,
  AllChatMessage,
  UknownGameMessage,
} from "@/lib/network/types";
import { ReactNode } from "react";
import {
  MessageContext,
  MessagePanel,
  ShowCustomMessageProps,
} from "./message-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RevealedElements } from "./revealed-elements";
import { LibraryElement } from "@/lib/game/types";

interface Props<TMessage> {
  messages: Stamped<AllChatMessage<TMessage>>[];
  context: MessageContext;
  ShowCustomMessage(props: ShowCustomMessageProps<TMessage>): ReactNode;
  elements: Record<string, LibraryElement[]>;
}

export function RightPanel<TMessage extends UknownGameMessage>({
  messages,
  context,
  ShowCustomMessage,
  elements,
}: Props<TMessage>) {
  return (
    <Tabs defaultValue="messages" className="h-full">
      <TabsList>
        <TabsTrigger value="messages">messages</TabsTrigger>
        <TabsTrigger value="revealed-elements">revealed elements</TabsTrigger>
      </TabsList>
      <TabsContent value="messages" className="h-full">
        <MessagePanel<TMessage>
          messages={messages}
          context={context}
          ShowCustomMessage={ShowCustomMessage}
        />
      </TabsContent>
      <TabsContent value="revealed-elements">
        <RevealedElements elements={elements} />
      </TabsContent>
    </Tabs>
  );
}
