import { clone, uuidv4 } from "@/lib/utils";
import {
  CairnCharacter,
  CairnCharacterBase,
  Gear,
  Slot,
  SlotState,
} from "./types";
import { pickRandom, roll } from "@/lib/random";
import {
  backgrounds,
  femaleNames,
  maleNames,
  surnames,
  traits,
} from "./character-generation-data";
import { allItems, itemsByCategory } from "./items-data";
import { Gauge } from "../types";

export function getEmptySlots(n: number, type: string): Slot[] {
  return [...Array(n)].map(() => ({
    id: uuidv4(),
    type,
    state: { type: "empty" },
  }));
}

export function getEmptyCharacterSlots(): Slot[] {
  return [
    { id: uuidv4(), type: "hand", state: { type: "empty" } },
    { id: uuidv4(), type: "hand", state: { type: "empty" } },
    { id: uuidv4(), type: "body", state: { type: "empty" } },
    { id: uuidv4(), type: "body", state: { type: "empty" } },
    { id: uuidv4(), type: "backpack", state: { type: "empty" } },
    { id: uuidv4(), type: "backpack", state: { type: "empty" } },
    { id: uuidv4(), type: "backpack", state: { type: "empty" } },
    { id: uuidv4(), type: "backpack", state: { type: "empty" } },
    { id: uuidv4(), type: "backpack", state: { type: "empty" } },
    { id: uuidv4(), type: "backpack", state: { type: "empty" } },
  ];
}

export function initCharacterBase(): CairnCharacterBase {
  return {
    id: uuidv4(),
    name: "",
    background: "",
    dexterity: { current: 0, max: 0 },
    strength: { current: 0, max: 0 },
    willpower: { current: 0, max: 0 },
    hp: { current: 0, max: 0 },
    age: 0,
    gold: 0,
    silver: 0,
    copper: 0,
    deprived: false,
    description: "",
    inventory: getEmptyCharacterSlots(),
  };
}

export function initBlankCharacter(): CairnCharacter {
  return {
    ...initCharacterBase(),
    hireLings: [],
    carryCapacities: [],
  };
}

export function initBasicCharacter(): CairnCharacter {
  const newNpc: CairnCharacter = {
    ...initBlankCharacter(),
    strength: { current: 10, max: 10 },
    dexterity: { current: 10, max: 10 },
    willpower: { current: 10, max: 10 },
    name: getRandomName(),
    description: generateTraits(),
  };
  return newNpc;
}

function newAttribute(val: number): Gauge {
  return {
    current: val,
    max: val,
  };
}

export function rollCharacterStats(char: CairnCharacter) {
  char.strength = newAttribute(roll(3, 6));
  char.dexterity = newAttribute(roll(3, 6));
  char.willpower = newAttribute(roll(3, 6));
  char.hp = newAttribute(roll(1, 6));
  char.age = roll(2, 20) + 10;
}

export function getRandomMaleName(): string {
  return `${pickRandom(maleNames)} ${pickRandom(surnames)}`;
}

export function getRandomFemaleName(): string {
  return `${pickRandom(femaleNames)} ${pickRandom(surnames)}`;
}

export function getRandomName(): string {
  return roll(1, 2) === 1 ? getRandomMaleName() : getRandomFemaleName();
}

export function generateTraits(): string {
  return `You have a ${pickRandom(traits.physique)} physique, ${pickRandom(
    traits.skin
  )} skin, ${pickRandom(traits.hair)} hair, and a ${pickRandom(
    traits.face
  )} face. You speak in a ${pickRandom(
    traits.speech
  )} manner and wear ${pickRandom(
    traits.clothing
  )} clothing. You are ${pickRandom(traits.vice)} yet ${pickRandom(
    traits.virtue
  )}, and are generally regarded as ${pickRandom(
    traits.reputation
  )}. You have had the misfortune of being ${pickRandom(traits.misfortunes)}.`;
}

function rollStartingArmor(): SlotState {
  const armorRoll = roll(1, 20);
  if (armorRoll <= 3) {
    return { type: "empty" };
  }
  if (armorRoll <= 14) {
    return {
      type: "gear",
      gear: clone(allItems.find((g) => g.name === "Brigandine")!),
    };
  }
  if (armorRoll <= 19) {
    return {
      type: "gear",
      gear: clone(allItems.find((g) => g.name === "Chainmail")!),
    };
  }
  if (armorRoll <= 20) {
    return {
      type: "gear",
      gear: clone(allItems.find((g) => g.name === "Plate Mail")!),
    };
  }
  throw new Error();
}

function rollStartingWeapon(): SlotState {
  const weaponRoll = roll(1, 20);
  if (weaponRoll <= 5) {
    const weaponName = pickRandom(["Dagger", "Cudgel", "Staff"]);
    return {
      type: "gear",
      gear: clone(allItems.find((g) => g.name === weaponName)!),
    };
  }
  if (weaponRoll <= 14) {
    const weaponName = pickRandom(["Sword", "Mace", "Axe"]);
    return {
      type: "gear",
      gear: clone(allItems.find((g) => g.name === weaponName)!),
    };
  }
  if (weaponRoll <= 19) {
    const weaponName = pickRandom(["Bow", "Crossbow", "Sling"]);
    return {
      type: "gear",
      gear: clone(allItems.find((g) => g.name === weaponName)!),
    };
  }
  if (weaponRoll <= 20) {
    const weaponName = pickRandom(["Halberd", "War Hammer", "Long Sword"]);
    return {
      type: "gear",
      gear: clone(allItems.find((g) => g.name === weaponName)!),
    };
  }
  throw new Error();
}

function giveHelmet(character: CairnCharacter) {
  const helmet = clone(allItems.find((g) => g.name === "Kettle Helm")!);
  if (character.inventory[3].state.type === "empty") {
    character.inventory[3].state = { type: "gear", gear: helmet };
  } else {
    character.inventory[6].state = { type: "gear", gear: helmet };
  }
}

function giveShield(character: CairnCharacter) {
  const shield = clone(allItems.find((g) => g.name === "Shield")!);
  if (character.inventory[1].state.type === "empty") {
    character.inventory[1].state = { type: "gear", gear: shield };
  } else {
    character.inventory[7].state = { type: "gear", gear: shield };
  }
}

function fillHelmetAndShield(character: CairnCharacter) {
  const rollResult = roll(1, 20);
  if (rollResult <= 13) {
    return;
  }
  if (rollResult <= 16) {
    giveHelmet(character);
    return;
  }
  if (rollResult <= 19) {
    giveShield(character);
    return;
  }
  if (rollResult <= 20) {
    giveHelmet(character);
    giveShield(character);
    return;
  }
  throw new Error();
}

function tryAddItem(character: CairnCharacter, item: Gear) {
  const freeSlot = character.inventory.find((s) => s.state.type === "empty");
  if (freeSlot === undefined) {
    return;
  }
  freeSlot.state = { type: "gear", gear: clone(item) };
}

export function fillCharacterGear(character: CairnCharacter) {
  character.gold = roll(3, 6);
  character.inventory[4].state = {
    type: "gear",
    gear: {
      id: uuidv4(),
      description: "",
      name: "rations",
      charges: { current: 3, max: 3 },
    },
  };
  character.inventory[5].state = {
    type: "gear",
    gear: { id: uuidv4(), description: "", name: "torch" },
  };
  const armor = rollStartingArmor();
  character.inventory[2].state = armor;
  if (armor.type === "gear" && armor.gear.bulky) {
    character.inventory[3].state = {
      type: "bulky",
      slotId: character.inventory[2].id,
      name: armor.gear.name,
    };
  }
  const weapon = rollStartingWeapon();
  character.inventory[0].state = weapon;
  if (weapon.type === "gear" && weapon.gear.bulky) {
    character.inventory[1].state = {
      type: "bulky",
      slotId: character.inventory[0].id,
      name: weapon.gear.name,
    };
  }
  fillHelmetAndShield(character);
  tryAddItem(character, pickRandom(itemsByCategory["expedition gears"]));
  tryAddItem(character, pickRandom(itemsByCategory.tools));
  tryAddItem(character, pickRandom(itemsByCategory.trinkets));
}

export function fillRandomCharacter(character: CairnCharacter) {
  character.background = pickRandom(backgrounds);
  character.description = generateTraits();
  character.name = getRandomName();
  fillCharacterGear(character);
}
