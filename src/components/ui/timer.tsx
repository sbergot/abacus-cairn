import { Timer } from "@/lib/game/types";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { PauseIcon, PlayIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "./button";
import { ILens } from "@/lib/types";

function formatNbr(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(timeInMs: number): string {
  const timeInSeconds = Math.round(timeInMs / 1000);
  const seconds = timeInSeconds % 60;
  const minutes = Math.floor(timeInSeconds / 60) % 60;
  const hours = Math.floor(seconds / 3600);
  return `${formatNbr(hours)}:${formatNbr(minutes)}:${formatNbr(seconds)}`;
}

interface Props {
  timerLens: ILens<Timer>;
  onDelete(): void;
}

export function Timer({ timerLens }: Props) {
  const timer = timerLens.state;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{timer.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Button
            variant="ghost"
            onClick={() =>
              timerLens.setState((d) => {
                d.isPaused = !d.isPaused;
              })
            }
          >
            {timer.isPaused ? <PlayIcon /> : <PauseIcon />}
          </Button>
          <Button
            variant="ghost"
            disabled={timer.isPaused}
            onClick={() =>
              timerLens.setState((d) => {
                d.currentTimeInMSec = 0;
              })
            }
          >
            <RefreshCwIcon />
          </Button>
          <div>{formatTime(timer.currentTimeInMSec)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
