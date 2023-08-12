import { uuidv4 } from "@/lib/utils";
import { CairnCharacter, Gauge } from "./types";
import { pickRandom, roll } from "@/lib/random";
import { femaleNames, maleNames, surnames } from "./data";

export function initCharacter(): CairnCharacter {
  return {
    id: uuidv4(),
    name: "",
    background: "",
    dexterity: { current: 0, max: 0 },
    strength: { current: 0, max: 0 },
    willpower: { current: 0, max: 0 },
    hp: { current: 0, max: 0 },
    age: 0,
    deprived: false,
    traits: [],
    inventory: [],
  };
}

function newAttribute(val: number): Gauge {
  return {
    current: val,
    max: val,
  };
}

export function rollCharacter(char: CairnCharacter) {
  char.strength = newAttribute(roll(3, 6));
  char.dexterity = newAttribute(roll(3, 6));
  char.willpower = newAttribute(roll(3, 6));
  char.hp = newAttribute(roll(1, 6));
  char.age = roll(2, 20) + 10;
}

export function getRandomMaleName(): string {
  return `${pickRandom(surnames)} ${pickRandom(maleNames)}`;
}

export function getRandomFemaleName(): string {
  return `${pickRandom(surnames)} ${pickRandom(femaleNames)}`;
}
