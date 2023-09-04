import { Clock } from "@/lib/game/types";
import { Card, CardContent, CardHeader } from "./card";
import {
  EyeIcon,
  EyeOffIcon,
  MinusIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "./button";
import { ILens } from "@/lib/types";
import { TitleWithIcons } from "./title-with-icons";
import { DeleteAlert } from "./delete-alert";
import { Progress } from "./progress";
import { TooltipShort } from "./tooltip-short";

interface Props {
  clockLens: ILens<Clock>;
  onDelete(): void;
}

export function ClockControl({ clockLens, onDelete }: Props) {
  const clock = clockLens.state;
  const progressPercent = (clock.gauge.current * 100) / clock.gauge.max;
  return (
    <Card className="w-52">
      <CardHeader>
        <TitleWithIcons name={clock.name}>
          <TooltipShort
            name={
              clock.visibleToAll
                ? "Make invisible to players"
                : "Make visible to players"
            }
          >
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                clockLens.setState((d) => {
                  d.visibleToAll = !d.visibleToAll;
                })
              }
            >
              {clock.visibleToAll ? <EyeIcon /> : <EyeOffIcon />}
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
            clock.
          </DeleteAlert>
        </TitleWithIcons>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 justify-between w-full">
          <div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                clockLens.setState((d) => {
                  d.gauge.current -= 1;
                })
              }
            >
              <MinusIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                clockLens.setState((d) => {
                  d.gauge.current += 1;
                })
              }
            >
              <PlusIcon />
            </Button>
          </div>
          <div>
            {clock.gauge.current} / {clock.gauge.max}
          </div>
        </div>
        <Progress value={progressPercent} />
      </CardContent>
    </Card>
  );
}
