"use client"

import {
  useCurrentCharacter,
  useLoggerContext,
} from "@/app/cairn-context";
import { Button } from "../ui/button";
import { hurt } from "@/lib/game/cairn/utils";

interface TakeDamageProps {
  damages: number;
}

export function TakeDamage({ damages }: TakeDamageProps) {
  const { setState } = useCurrentCharacter();
  const log = useLoggerContext();
  return (
    <Button
      onClick={() =>
        setState((d) => {
          hurt(d, damages, log);
        })
      }
    >
      Take damage
    </Button>
  );
}

