import { useLoggerContext } from "@/app/cairn-context";
import { DicesIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { pickRandom } from "@/lib/random";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { scars } from "@/lib/game/cairn/other-data";
import { DiceSelect } from "./dice-select";
import { ButtonLike } from "../ui/button-like";
import { maxRoll } from "@/lib/dice/dice";

export function GenericRolls() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonLike variant="ghost" size="xs" className="flex gap-2 w-full">
          <DicesIcon  /><div className="flex-grow">Generic rolls</div>
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="attack">
          <TabsList>
            <TabsTrigger value="attack">Attack</TabsTrigger>
            <TabsTrigger value="scar">Scar</TabsTrigger>
          </TabsList>
          <TabsContent value="attack">
            <AttackRoll close={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="scar">
            <ScarRoll close={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface CloseProps {
  close(): void;
}

function AttackRoll({ close }: CloseProps) {
  const log = useLoggerContext();
  const [dice, setDice] = useState<number>(4);
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="w-40">
          <DiceSelect dice={dice} setDice={(n) => setDice(n ?? 4)} />
        </div>
        <Button
          onClick={() => {
            log({
              kind: "chat-custom",
              type: "AttackRoll",
              title: "Generic attack roll",
              props: { dice: { number: 1, sides: dice }, result: maxRoll({ number: 1, sides: dice }) },
            });
            close();
          }}
          className="w-full"
        >
          Roll attack
        </Button>
      </div>
    </>
  );
}

function ScarRoll({ close }: CloseProps) {
  const log = useLoggerContext();
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => {
          log({
            kind: "chat-common",
            type: "BasicMessage",
            props: {
              content: pickRandom(scars),
            },
          });
          close();
        }}
        className="w-full"
      >
        Roll scar
      </Button>
    </div>
  );
}
