import { uuidv4 } from "@/lib/utils";
import { AbilityCheck, AbilityRollAnalysis, CairnCharacter, CairnGame, Gauge, Slot } from "./types";
import { maxRoll, minRoll, poolRoll } from "@/lib/dice/dice";

export function abilityCheck(check: AbilityCheck): AbilityRollAnalysis {
  const { abilityValue, mode } = check;
  switch (mode) {
    case "normal": {
      const pool = { number: 1, sides: 20 };
      const {
        results: [value],
      } = poolRoll(pool);
      return {
        check,
        results: {
          pool,
          results: [{ value, valid: true }],
          rollValue: value,
        },
        isSuccess: value <= abilityValue,
      };
    }
    case "advantage": {
      const pool = { number: 2, sides: 20 };
      const results = minRoll(pool);
      return {
        check,
        results,
        isSuccess: results.rollValue <= abilityValue,
      };
    }
    case "disadvantage": {
      const pool = { number: 2, sides: 20 };
      const results = maxRoll(pool);
      return {
        check,
        results,
        isSuccess: results.rollValue <= abilityValue,
      };
    }
  }
}

export function initGame(name: string): CairnGame {
  return {
    id: uuidv4(),
    title: name,
    messages: [],
    customEntries: [],
    timers: [],
  };
}

export function clampGauge(g: Gauge): void {
  g.current = Math.min(g.max, Math.max(0, g.current));
}

export function updateGauge(g: Gauge, update: (v: number) => number) {
  g.current = update(g.current);
  clampGauge(g);
}


function sum(values: number[]) {
  return values.reduce((acc, v) => acc + v, 0);
}

function readArmorValue(slot: Slot) {
  if (slot.state.type !== "gear" || slot.type === "backpack") {
    return 0;
  }

  const values = slot.state.gear.tags.map((t) =>
    t.type === "armor" || t.type === "shield" ? t.armor : 0
  );

  return sum(values);
}

export function getArmorValue(character: CairnCharacter): number {
  return Math.min(3, sum(character.inventory.map(readArmorValue)));
}