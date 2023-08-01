import { uuidv4 } from "@/lib/utils";
import {
  Ability,
  AbilityCheck,
  AbilityRollAnalysis,
  Character,
  RollMode,
} from "./types";
import { roll } from "@/lib/random";
import { maxRoll, minRoll, poolRoll, simpleRoll } from "@/lib/dice/dice";

export function initCharacter(): Character {
  return {
    id: uuidv4(),
    name: "",
    background: "",
    dexterity: { current: 0, max: 0 },
    strength: { current: 0, max: 0 },
    willpower: { current: 0, max: 0 },
    hp: { current: 0, max: 0 },
  };
}

function newAttribute(val: number): Ability {
  return {
    current: val,
    max: val,
  };
}

export function rollCharacter(): Character {
  const char = initCharacter();
  char.strength = newAttribute(roll(3, 6));
  char.dexterity = newAttribute(roll(3, 6));
  char.willpower = newAttribute(roll(3, 6));
  char.hp = newAttribute(roll(1, 6));
  return char;
}

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
        isSuccess: value <= abilityValue
      };
    }
    case "advantage": {
      const pool = { number: 2, sides: 20 };
      const results = minRoll(pool);
      return {
        check,
        results,
        isSuccess: results.rollValue <= abilityValue
      };
    }
    case "disadvantage": {
      const pool = { number: 2, sides: 20 };
      const results = maxRoll(pool);
      return {
        check,
        results,
        isSuccess: results.rollValue <= abilityValue
      };
    }
  }
}
