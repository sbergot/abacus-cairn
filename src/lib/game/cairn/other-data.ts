import { uuidv4 } from "@/lib/utils";
import { CarryCapacity } from "./types";

export const scars: string[] = [
  "Lasting Scar: Roll 1d6 | 1: Neck, 2: Hands, 3: Eye, 4: Chest, 5: Legs, 6: Ear. Roll 1d6. If the total is higher than your max HP, take the new result.",
  "Rattling Blow: You’re disoriented and shaken. Describe how you refocus. Roll 1d6. If the total is higher than your max HP, take the new result.",
  "Walloped: You’re sent flying and land flat on your face, winded. You are deprived until you rest for a few hours. Then, roll 1d6. Add that amount to your max HP.",
  "Broken Limb: Roll 1d6 | 1-2: Leg, 3-4: Arm, 5: Rib, 6: Skull. Once mended, roll 2d6. If the total is higher than your max HP, take the new result.",
  "Diseased: You’re afflicted with a gross, uncomfortable infection. When you get over it, roll 2d6. If the total is higher than your max HP, take the new result.",
  "Reorienting Head Wound: Roll 1d6 | 1-2: STR, 3-4: DEX, 5-6: WIL. Roll 3d6. If the total is higher than your current ability score, take the new result.",
  "Hamstrung: You can barely move until you get serious help and rest. After recovery, roll 3d6. If the total is higher than your max DEX, take the new result.",
  "Deafened: You cannot hear anything until you find extraordinary aid. Regardless, make a WIL save. If you pass, increase your max WIL by 1d4.",
  "Re-brained: Some hidden part of your psyche is knocked loose. Roll 3d6. If the total is higher than your max WIL, take the new result.",
  "Sundered: An appendage is torn off, crippled or useless. The Warden will tell you which. Then, make a WIL save. If you pass, increase your max WIL by 1d6.",
  "Mortal Wound: You are deprived and out of action. You die in one hour unless healed. Upon recovery, roll 2d6. Take the new result as your max HP.",
  "Doomed: Death seemed ever so close, but somehow you survived. If your next save against critical damage is a fail, you die horribly. If you pass, roll 3d6. If the total is higher than your max HP, take the new result.",
];

export const carryCapacities: CarryCapacity[] = [
  {
    id: "6d1e0553-a867-4329-bba9-0bd098ad480e",
    name: "cart",
    description: "must be pulled with both hands",
    price: 30,
    inventory: [
      { id: uuidv4(), state: { type: "empty" }, type: "cart" },
      { id: uuidv4(), state: { type: "empty" }, type: "cart" },
      { id: uuidv4(), state: { type: "empty" }, type: "cart" },
      { id: uuidv4(), state: { type: "empty" }, type: "cart" },
    ],
  },
  {
    id: "d656f7be-f995-41f2-80d7-7c6b4820ab8c",
    name: "horse",
    description: "",
    price: 75,
    inventory: [
      { id: uuidv4(), state: { type: "empty" }, type: "horse" },
      { id: uuidv4(), state: { type: "empty" }, type: "horse" },
      { id: uuidv4(), state: { type: "empty" }, type: "horse" },
      { id: uuidv4(), state: { type: "empty" }, type: "horse" },
    ],
  },
  {
    id: "b1fb787e-dcd0-4a90-8fa8-92c65a0e1495",
    name: "mule",
    description: "slow",
    price: 30,
    inventory: [
      { id: uuidv4(), state: { type: "empty" }, type: "mule" },
      { id: uuidv4(), state: { type: "empty" }, type: "mule" },
      { id: uuidv4(), state: { type: "empty" }, type: "mule" },
      { id: uuidv4(), state: { type: "empty" }, type: "mule" },
      { id: uuidv4(), state: { type: "empty" }, type: "mule" },
      { id: uuidv4(), state: { type: "empty" }, type: "mule" },
    ],
  },
  {
    id: "835c223a-c6de-4354-ba28-2d62f2b834d6",
    name: "wagon",
    description: "heavy",
    price: 200,
    inventory: [
      { id: uuidv4(), state: { type: "empty" }, type: "wagon" },
      { id: uuidv4(), state: { type: "empty" }, type: "wagon" },
      { id: uuidv4(), state: { type: "empty" }, type: "wagon" },
      { id: uuidv4(), state: { type: "empty" }, type: "wagon" },
      { id: uuidv4(), state: { type: "empty" }, type: "wagon" },
      { id: uuidv4(), state: { type: "empty" }, type: "wagon" },
      { id: uuidv4(), state: { type: "empty" }, type: "wagon" },
      { id: uuidv4(), state: { type: "empty" }, type: "wagon" },
    ],
  },
];
