import { useEffect, useMemo, useRef } from "react";
import { getSubLens, uuidv4 } from "./utils";
import useLocalStorage from "use-local-storage";
import { Draft, produce } from "immer";
import { usePathname, useSearchParams } from "next/navigation";
import { useCurrentGenericGame } from "./game-context";
import { useLoggerContext } from "@/app/cairn-context";
import { useImmer } from "use-immer";
import { ILens } from "./types";

export function useBrowserId(): string {
  return useMemo(() => {
    const key = "browser_id";
    const cached = localStorage.getItem(key);
    if (cached) {
      return cached;
    }
    const newId = uuidv4();
    localStorage.setItem(key, newId);
    return newId;
  }, []);
}

export function useImmerLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (r: (d: Draft<T>) => void) => void] {
  const [value, setValue] = useLocalStorage(key, defaultValue, {
    syncData: true,
  });
  function setImmerValue(recipe: (v: Draft<T>) => void): void {
    setValue((oldVal: T | undefined) =>
      produce<T>(oldVal ?? defaultValue, (d) => recipe(d))
    );
  }
  return [value, setImmerValue];
}

export function useLens<T>(defaultValue: T): ILens<T> {
  const [state, setState] = useImmer(defaultValue);
  return { state, setState };
}

export function useRelativeLinker() {
  const pathName = usePathname();
  return (path: string, searchParams: Record<string, string> | null = null) => {
    const querystring =
      searchParams === null
        ? ""
        : `?${Object.entries(searchParams)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`;
    return `${pathName}/${path}${querystring}`;
  };
}

export function useUrlParams(): Record<string, string> {
  const searchParams = Array.from(useSearchParams().entries());
  const result: Record<string, string> = {};
  searchParams.forEach(([key, value]) => {
    result[key] = value;
  });
  return result;
}

export function useTickingTimers() {
  const gameLens = useCurrentGenericGame();
  const log = useLoggerContext();
  const timerLens = getSubLens(gameLens, "timers");
  const lensRef = useRef(timerLens);
  lensRef.current = timerLens;

  // pause every timer when starting a game
  useEffect(() => {
    lensRef.current.setState((d) => {
      d.forEach((t) => {
        t.isPaused = true;
      });
    });
  }, []);

  // check finished timers and restart recurring ones
  useEffect(() => {
    const finishedTimers = lensRef.current.state
      .filter((t) => t.currentTimeInMSec >= t.intervalInSec * 1000)
      .map((t) => t.id);
    if (finishedTimers.length > 0) {
      lensRef.current.setState((d) => {
        finishedTimers.forEach((timerId) => {
          const timerToCheck = d.find((t) => t.id === timerId)!;
          timerToCheck.currentTimeInMSec = 0;
          if (!timerToCheck.isRecurring) {
            timerToCheck.isPaused = true;
          }
        });
      });
      lensRef.current.state
        .filter((t) => t.currentTimeInMSec >= t.intervalInSec * 1000)
        .forEach((t) => {
          log({
            kind: "chat-common",
            type: "SimpleMessage",
            props: { content: `timer ${t.name} finished!` },
            transient: true,
            gmOnly: !t.isPublic,
          });
        });
    }
  }, [gameLens]);

  // tick every unpaused timer
  useEffect(() => {
    let previousTick = new Date();
    let previousRunningTimerIds = lensRef.current.state
      .filter((t) => !t.isPaused)
      .map((t) => t.id);
    const handle = setInterval(() => {
      const nextRunningTimerIds = lensRef.current.state
        .filter((t) => !t.isPaused)
        .map((t) => t.id);
      const timersToUpdate = nextRunningTimerIds.filter((t) =>
        previousRunningTimerIds.includes(t)
      );
      previousRunningTimerIds = nextRunningTimerIds;

      const nextTick = new Date();
      const delta = nextTick.getTime() - previousTick.getTime();
      previousTick = nextTick;

      lensRef.current.setState((d) => {
        d.filter((t) => timersToUpdate.includes(t.id)).forEach((t) => {
          t.currentTimeInMSec += delta;
        });
      });
    }, 1000);

    return () => {
      clearInterval(handle);
    }
  }, []);
}
