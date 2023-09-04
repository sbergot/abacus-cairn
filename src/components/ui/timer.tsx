import { Timer } from "@/lib/game/types";
import { Card, CardContent, CardHeader } from "./card";
import {
  EyeIcon,
  EyeOffIcon,
  PauseIcon,
  PlayIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "./button";
import { ILens } from "@/lib/types";
import { TitleWithIcons } from "./title-with-icons";
import { DeleteAlert } from "./delete-alert";
import { Progress } from "./progress";
import { TooltipShort } from "./tooltip-short";

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

export function TimerControl({ timerLens, onDelete }: Props) {
  const timer = timerLens.state;
  const progressPercent =
    (timer.currentTimeInMSec * 100) / (timer.intervalInSec * 1000);
  return (
    <Card>
      <CardHeader>
        <TitleWithIcons name={timer.name}>
          <TooltipShort
            name={
              timer.visibleToAll
                ? "Make invisible to players"
                : "Make visible to players"
            }
          >
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                timerLens.setState((d) => {
                  d.visibleToAll = !d.visibleToAll;
                })
              }
            >
              {timer.visibleToAll ? <EyeIcon /> : <EyeOffIcon />}
            </Button>
          </TooltipShort>
          <DeleteAlert
            icon={
              <Button variant="ghost" size="icon-sm">
                <Trash2Icon />
              </Button>
            }
            onConfirm={onDelete}
          >
            This action cannot be undone. This will permanently delete the
            timer.
          </DeleteAlert>
        </TitleWithIcons>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
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
            size="icon-sm"
            onClick={() =>
              timerLens.setState((d) => {
                d.currentTimeInMSec = 0;
              })
            }
          >
            <RefreshCwIcon />
          </Button>
          <div className="w-20">{formatTime(timer.currentTimeInMSec)}</div>
        </div>
        <Progress value={progressPercent} />
      </CardContent>
    </Card>
  );
}
