import { clone, uuidv4 } from "@/lib/utils";
import {
  AbilityCheck,
  AbilityRollAnalysis,
  CairnCharacter,
  CairnGame,
  CairnMessage,
  CairnNpc,
  Gear,
  Slot,
} from "./types";
import { maxRoll, minRoll, poolRoll } from "@/lib/dice/dice";
import { AllChatMessage, Logger } from "@/lib/network/types";
import { Gauge } from "../types";
import { monsters } from "./monster-data";

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
    name,
    messages: [],
    content: [
      {
        id: uuidv4(),
        name: "NPC",
        type: "character",
        entries: [],
        description: "",
      },
      {
        id: uuidv4(),
        name: "Item",
        type: "item",
        entries: [],
        description: "",
      },
      {
        id: uuidv4(),
        name: "Location",
        type: "misc",
        entries: [],
        description: "",
      },
      {
        id: uuidv4(),
        name: "Monster",
        type: "character",
        entries: monsters.map(m => clone(m)),
        description: "",
      },
    ],
    timers: [],
    clocks: [],
    customData: {},
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

  return slot.state.gear.armor ?? 0;
}

export function getArmorValue(character: CairnCharacter): number {
  return Math.min(3, sum(character.inventory.map(readArmorValue)));
}

export function hurt(
  character: CairnCharacter,
  damages: number,
  log: (m: AllChatMessage<CairnMessage>) => void,
  gmOnly: boolean | null = null
) {
  const adjusted = damages - getArmorValue(character);

  if (character.hp.current > adjusted) {
    character.hp.current -= adjusted;
    return;
  }

  if (character.hp.current === adjusted) {
    character.hp.current = 0;
    log({
      kind: "chat-custom",
      type: "Scarred",
      props: {},
    });
    return;
  }

  if (character.hp.current < adjusted) {
    const residual = adjusted - character.hp.current;
    character.hp.current = 0;
    character.strength.current -= residual;
    log({
      kind: "chat-common",
      type: "BasicMessage",
      title: `Critical damage on ${character.name}`,
      props: { content: "Make a strength save to avoid critical damage." },
      gmOnly: gmOnly ?? false,
    });
    return;
  }
}

export function getDamages(slot: Slot) {
  return slot.state.type === "gear" && slot.state.gear.damage !== undefined
    ? slot.state.gear.damage
    : 0;
}

export function getDamageDiceNbr(slot: Slot) {
  return slot.state.type === "gear" && slot.state.gear.damageDiceNbr !== undefined
    ? slot.state.gear.damageDiceNbr
    : 1;
}

export function switchHirelingToMainCharacter(
  character: CairnCharacter,
  hireLingId: string
) {
  const newMain = clone(character.hireLings.find((h) => h.id === hireLingId)!);
  newMain.id = character.id;
  newMain.hireLings = character.hireLings.filter((h) => h.id !== hireLingId);
  newMain.carryCapacities = character.carryCapacities;
  character.id = uuidv4();
  character.hireLings = [];
  character.carryCapacities = [];
  newMain.hireLings.push(character);
  return newMain;
}

export function dropItem(inventory: Slot[], slotId: string) {
  const slotToEmpty = inventory.find((s) => s.id === slotId)!;
  slotToEmpty.state = { type: "empty" };
  const otherSlot = inventory.find(
    (s) => s.state.type === "bulky" && s.state.slotId === slotToEmpty.id
  );
  if (otherSlot !== undefined) {
    otherSlot.state = { type: "empty" };
  }
}

export function grabItem(
  character: CairnCharacter,
  gear: Gear,
  slotId: string,
  log: Logger<CairnMessage>
) {
  const currentContainer = findContainer(character, slotId);
  const currentSlot = currentContainer.find((s) => s.id === slotId)!;
  const siblingFreeSlot = findFreeSiblingSlot(currentContainer, currentSlot);

  const slot = currentContainer.find((s) => s.id === slotId)!;
  slot.state = { type: "gear", gear: clone(gear) };
  if (gear.bulky) {
    const otherSlot = currentContainer.find(
      (s) => s.id === siblingFreeSlot?.id
    )!;
    otherSlot.state = {
      type: "bulky",
      slotId,
      name: gear.name,
    };
  }

  if (character.inventory.every((s) => s.state.type !== "empty")) {
    log({
      kind: "chat-common",
      type: "BasicMessage",
      title: "Overburdened",
      props: { content: "reduce your HP to 0" },
    });
  }
}

export function findContainer(
  character: CairnCharacter,
  slotId: string
): Slot[] {
  if (character.inventory.find((s) => s.id === slotId) !== undefined) {
    return character.inventory;
  }

  for (const carryCapacity of character.carryCapacities) {
    if (carryCapacity.inventory.find((s) => s.id === slotId) !== undefined) {
      return carryCapacity.inventory;
    }
  }

  return [];
}

export function findFreeSiblingSlot(inventory: Slot[], currentSlot: Slot) {
  const siblingFreeSlot = inventory.find(
    (s) =>
      s.type === currentSlot.type &&
      s.state.type === "empty" &&
      s.id !== currentSlot.id
  );
  return siblingFreeSlot;
}

export function getAllNpcs(game: CairnGame) {
  return game.content
    .filter((category) => category.type === "character")
    .flatMap((category) => category.entries as CairnNpc[]);
}
