"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import {
  CairnCharacter,
  CairnMessage,
} from "@/lib/game/cairn/types";
import { useGmConnectionContext } from "@/app/cairn/cairn-context";
import { ShowCustomMessage } from "@/components/cairn/show-custom-message";
import { WeakEmph } from "@/components/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { CharacterEntry } from "./character-entry";
import { AllContent } from "./all-content";
import { RightPanel } from "@/components/generic-pages/right-panel";

export default function Session() {
  const { messages, revealedElements } = useGmConnectionContext();
  return (
    <TwoColumns
      leftPart={<GmTabs />}
      rightPart={
        <RightPanel<CairnMessage>
          context={{ contextType: "gm", authorId: "gm" }}
          messages={messages}
          ShowCustomMessage={ShowCustomMessage}
          elements={revealedElements}
        />
      }
    />
  );
}

function GmTabs() {
  return (
    <Tabs defaultValue="connections">
      <TabsList>
        <TabsTrigger value="connections">connections</TabsTrigger>
        <TabsTrigger value="characters">characters</TabsTrigger>
        <TabsTrigger value="content">content</TabsTrigger>
      </TabsList>
      <TabsContent value="characters">
        <AllCharacters />
      </TabsContent>
      <TabsContent value="connections">
        <AllConnections />
      </TabsContent>
      <TabsContent value="content">
        <AllContent />
      </TabsContent>
    </Tabs>
  );
}

function AllConnections() {
  const { connections, sessionCode } = useGmConnectionContext();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="align-text-bottom">table id: {sessionCode} </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            navigator.clipboard.writeText(sessionCode);
          }}
        >
          <CopyIcon size={20} />
        </Button>
      </div>
      <div>
        Provide this id to the player to let them join this table. Refreshing
        this page will create a new id.
      </div>
      <div>
        <div>Connected players:</div>
        {connections.map((c) => (
          <div key={c.id}>
            <WeakEmph>{c.id}</WeakEmph> - {c.character?.name ?? "??"} -{" "}
            {c.state}
          </div>
        ))}
      </div>
    </div>
  );
}

interface AllCharactersProps {}

function AllCharacters({}: AllCharactersProps) {
  const { connections } = useGmConnectionContext();
  const allCharacters = connections
    .map((conn) => conn.character)
    .filter((c) => !!c) as CairnCharacter[];

  return (
    <>
      {allCharacters.map((c) => (
        <CharacterEntry key={c.id} character={c} />
      ))}
    </>
  );
}
