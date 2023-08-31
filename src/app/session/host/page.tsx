"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { CairnCharacter, CairnMessage } from "@/lib/game/cairn/types";
import { useCurrentGame, useGmConnectionContext } from "@/app/cairn-context";
import { ShowCustomMessage } from "@/components/cairn/show-custom-message";
import { WeakEmph } from "@/components/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { CharacterEntry } from "./character-entry";
import { AllContent } from "./all-content";
import { RightPanel } from "@/components/generic-pages/right-panel";
import { TimerEditDialog } from "@/components/ui/timer-edit-dialog";
import { getSubArrayLens, getSubLens } from "@/lib/utils";
import { Timer } from "@/components/ui/timer";
import { ClockEditDialog } from "@/components/ui/clocks-edit-dialog";
import { Clock } from "@/components/ui/clock";
import { useToast } from "@/components/ui/use-toast";

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
  const { connections, sessionCode } = useGmConnectionContext();
  const { toast } = useToast();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="align-text-bottom">table id: {sessionCode} </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            global.navigator.clipboard.writeText(sessionCode);
            toast({ title: "table id copied", description: sessionCode });
          }}
        >
          <CopyIcon />
        </Button>
      </div>
      <div>
        Provide this id to the player to let them join this table. Refreshing
        this page will create a new id.
      </div>
    </div>
  );
}

interface AllCharactersProps {}

function AllCharacters({}: AllCharactersProps) {
  const { connections } = useGmConnectionContext();

  if (connections.length === 0) {
    return <div>No player connected</div>;
  }
  return (
    <>
      <div>Connected players:</div>
      {connections.map((c) => (
        <>
          <div key={c.id}>
            <WeakEmph>{c.id}</WeakEmph> - {c.character?.name ?? "??"} -{" "}
            {c.state}
          </div>
          {c.character && <CharacterEntry key={c.id} character={c.character} />}
          {!c.character && <div>no character received</div>}
        </>
      ))}
    </>
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
      {timersLens.state.length === 0 && <div>No timer defined</div>}
      <div className="flex flex-wrap gap-4">
        {timersLens.state.map((timer, idx) => (
          <Timer
            key={timer.id}
            timerLens={getSubArrayLens(timersLens, idx)}
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
      {clocksLens.state.length === 0 && <div>No clock defined</div>}
      <div className="flex flex-wrap gap-4">
        {clocksLens.state.map((clock, idx) => (
          <Clock
            key={clock.id}
            clockLens={getSubArrayLens(clocksLens, idx)}
            onDelete={() =>
              clocksLens.setState((d) => d.filter((t) => t.id !== clock.id))
            }
          />
        ))}
      </div>
    </div>
  );
}
