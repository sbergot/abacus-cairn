import { uuidv4 } from "@/lib/utils";
import { Ability, Character } from "./types";
import { roll } from "@/lib/random";

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
    max: val
  };
}

export function rollCharacter(): Character {
  const char = initCharacter();
  char.strength = newAttribute(roll(3, 6));
  char.dexterity = newAttribute(roll(3, 6));
  char.willpower = newAttribute(roll(3, 6));
  char.hp = newAttribute(roll(1, 6))
  return char;
}