"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { CairnMessage } from "@/lib/game/cairn/types";
import {
  useCurrentGame,
  useGmConnectionContext,
} from "@/app/cairn-context";
import { ShowCairnMessage } from "@/components/cairn/show-cairn-message";
import { StrongEmph, WeakEmph } from "@/components/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { CharacterEntry } from "./character-entry";
import { AllContent } from "./all-content";
import { RightPanel } from "@/components/generic-pages/right-panel";
import { TimerEditDialog } from "@/components/ui/timer-edit-dialog";
import {
  getSubArrayLensById,
  getSubLens,
} from "@/lib/utils";
import { TimerControl } from "@/components/ui/timer";
import { ClockEditDialog } from "@/components/ui/clocks-edit-dialog";
import { ClockControl } from "@/components/ui/clock";
import { useToast } from "@/components/ui/use-toast";
import { useRelativeLinker } from "@/lib/hooks";

export default function Session() {
  const { messages, revealedElements } = useGmConnectionContext();
  return (
    <TwoColumns
      leftPart={<GmTabs />}
      rightPart={
        <RightPanel<CairnMessage>
          context={{ contextType: "gm", authorId: "gm" }}
          messages={messages}
          ShowCustomMessage={ShowCairnMessage}
          elements={revealedElements}
        />
      }
    />
  );
}

function GmTabs() {
  return (
    <Tabs defaultValue="characters">
      <TabsList>
        <TabsTrigger value="characters">characters</TabsTrigger>
        <TabsTrigger value="content">content</TabsTrigger>
        <TabsTrigger value="timers">timers</TabsTrigger>
      </TabsList>
      <TabsContent value="characters">
        <div className="flex flex-col gap-4">
          <InviteLinks />
          <AllCharacters />
        </div>
      </TabsContent>
      <TabsContent value="content">
        <AllContent />
      </TabsContent>
      <TabsContent value="timers">
        <div className="flex flex-col gap-4">
          <AllTimers />
          <AllClocks />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function InviteLinks() {
  const { sessionCode } = useGmConnectionContext();
  const linker = useRelativeLinker();
  const joinLink = new URL(
    linker(`../../invitation?tableId=${sessionCode}`),
    document.baseURI
  ).href;
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div>
          <span className="align-text-bottom">
            table id: <WeakEmph>{sessionCode}</WeakEmph>{" "}
          </span>
          <CopyButton name="table id" content={sessionCode} />
        </div>
        <div>
          <span className="align-text-bottom">
            table link: <WeakEmph>{joinLink}</WeakEmph>{" "}
          </span>
          <CopyButton name="table link" content={joinLink} />
        </div>
      </div>
      <div>
        Provide this link or id to the player to let them join this table.{" "}
        <StrongEmph>Warning</StrongEmph>: refreshing this page will create a new
        id.
      </div>
    </div>
  );
}

interface CopyButtonProps {
  content: string;
  name: string;
}

function CopyButton({ name, content }: CopyButtonProps) {
  const { toast } = useToast();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => {
        global.navigator.clipboard.writeText(content);
        toast({ title: `${name} copied`, description: content });
      }}
    >
      <CopyIcon />
    </Button>
  );
}

function AllCharacters() {
  const { connections } = useGmConnectionContext();

  if (connections.length === 0) {
    return <WeakEmph>No player connected</WeakEmph>;
  }
  return (
    <div>
      <div>Connected players:</div>
      <div className="flex flex-col gap-4">
        {connections.map((c) => (
          <div key={c.id}>
            <div>
              <WeakEmph>{c.id}</WeakEmph> - {c.state}
            </div>
            {c.character && <CharacterEntry character={c.character} />}
            {!c.character && <WeakEmph>no character received</WeakEmph>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AllTimers() {
  const gameLens = useCurrentGame();
  const timersLens = getSubLens(gameLens, "timers");
  return (
    <div className="flex flex-col gap-2 items-start">
      <TimerEditDialog
        onCreate={(t) =>
          timersLens.setState((d) => {
            d.push(t);
          })
        }
      />
      {timersLens.state.length === 0 && <WeakEmph>No timer defined</WeakEmph>}
      <div className="flex flex-wrap gap-4">
        {timersLens.state.map((timer) => (
          <TimerControl
            key={timer.id}
            timerLens={getSubArrayLensById(timersLens, timer.id)}
            onDelete={() =>
              timersLens.setState((d) => d.filter((t) => t.id !== timer.id))
            }
          />
        ))}
      </div>
    </div>
  );
}

function AllClocks() {
  const gameLens = useCurrentGame();
  const clocksLens = getSubLens(gameLens, "clocks");
  return (
    <div className="flex flex-col gap-2 items-start">
      <ClockEditDialog
        onCreate={(t) =>
          clocksLens.setState((d) => {
            d.push(t);
          })
        }
      />
      {clocksLens.state.length === 0 && <WeakEmph>No clock defined</WeakEmph>}
      <div className="flex flex-wrap gap-4">
        {clocksLens.state.map((clock, idx) => (
          <ClockControl
            key={clock.id}
            clockLens={getSubArrayLensById(clocksLens, clock.id)}
            onDelete={() =>
              clocksLens.setState((d) => d.filter((t) => t.id !== clock.id))
            }
          />
        ))}
      </div>
    </div>
  );
}
