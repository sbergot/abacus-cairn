import { Gear } from "./types";

export const femaleNames: string[] = [
  "Agune",
  "Beatrice",
  "Breagan",
  "Bronwyn",
  "Cannora",
  "Drelil",
  "Elgile",
  "Esme",
  "Griya",
  "Henaine",
  "Lirann",
  "Lirathil",
  "Lisabeth",
  "Moralil",
  "Morgwen",
  "Sybil",
  "Theune",
  "Wenain",
  "Ygwal",
  "Yslen",
];

export const maleNames: string[] = [
  "Arwel",
  "Bevan",
  "Boroth",
  "Borrid",
  "Breagle",
  "Breglor",
  "Canhoreal",
  "Emrys",
  "Ethex",
  "Gringle",
  "Grinwit",
  "Gruwid",
  "Gruwth",
  "Gwestin",
  "Mannog",
  "Melnax",
  "Orthax",
  "Triunein",
  "Wenlan",
  "Yirmeor",
];

export const surnames: string[] = [
  "Abernathy",
  "Addercap",
  "Burl",
  "Candlewick",
  "Cormick",
  "Crumwaller",
  "Dunswallow",
  "Getri",
  "Glass",
  "Harkness",
  "Harper",
  "Loomer",
  "Malksmilk",
  "Smythe",
  "Sunderman",
  "Swinney",
  "Thatcher",
  "Tolmen",
  "Weaver",
  "Wolder",
];

export const backgrounds: string[] = [
  "an alchemist",
  "a blacksmith",
  "a butcher",
  "a burglar",
  "a carpenter",
  "a cleric",
  "a gambler",
  "a gravedigger",
  "an herbalist",
  "a hunter",
  "a magician",
  "a mercenary",
  "a merchant",
  "a miner",
  "an outlaw",
  "a performer",
  "a pickpocket",
  "a smuggler",
  "a servant",
  "a ranger",
];

export const physiques: string[] = [
  "a statuesque",
  "a brawny",
  "a towering",
  "a stout",
  "a rugged",
  "an athletic",
  "a lanky",
  "a short",
  "a scrawny",
  "a flabby",
];

export const skins: string[] = [
  "dark",
  "a birthmark on your",
  "tanned",
  "pockmarked",
  "weathered",
  "oily",
  "pale",
  "perfect",
  "rosy",
  "tattooed",
];

export const hairs: string[] = [
  "bald",
  "braided",
  "oily",
  "wavy",
  "curly",
  "long",
  "wispy",
  "filthy",
  "frizzy",
  "luxurious",
];

export const faces: string[] = [
  "a chiseled",
  "a square",
  "a bony",
  "a sharp",
  "a sunken",
  "an elongated",
  "a broken",
  "a soft",
  "a rat-like",
  "a round",
];

export const speeches: string[] = [
  "blunt",
  "booming",
  "droning",
  "gravelly",
  "cryptic",
  "formal",
  "stuttering",
  "precise",
  "squeaky",
  "whispery",
];

export const clothings: string[] = [
  "antique",
  "bloody",
  "rancid",
  "soiled",
  "frumpy",
  "elegant",
  "frayed",
  "foreign",
  "livery",
  "filthy",
];

export const virtues: string[] = [
  "ambitious",
  "courageous",
  "disciplined",
  "honorable",
  "serene",
  "merciful",
  "humble",
  "tolerant",
  "gregarious",
  "cautious",
];

export const vices: string[] = [
  "aggressive",
  "bitter",
  "craven",
  "deceitful",
  "greedy",
  "vengeful",
  "lazy",
  "nervous",
  "rude",
  "vain",
];

export const reputations: string[] = [
  "an oddball",
  "wise",
  "respected",
  "ambitious",
  "repulsive",
  "dangerous",
  "honest",
  "a boor",
  "a loafer",
  "an entertainer",
];

export const misfortunes: string[] = [
  "abandoned",
  "addicted",
  "blackmailed",
  "condemned",
  "cursed",
  "defrauded",
  "demoted",
  "discredited",
  "disowned",
  "exiled",
];

const weapons: Gear[] = [
  {
    id: "58b86ef7-65cc-4992-9e96-8397496cfbf2",
    name: "Sword",
    tags: [
      { type: "weapon", damage: 8 },
      { type: "price", price: 10 },
    ],
  },
  {
    id: "1c4539b6-00a6-4b38-ba3b-3044660815a2",
    name: "Spear",
    tags: [
      { type: "weapon", damage: 8 },
      { type: "price", price: 10 },
    ],
  },
  {
    id: "77442b15-df4f-4083-9f05-1136f932284f",
    name: "Hand Axe",
    tags: [
      { type: "weapon", damage: 8 },
      { type: "price", price: 10 },
    ],
  },
  {
    id: "9b7a3ca4-934f-4f29-b7f2-994821bbdf2d",
    name: "Dagger",
    tags: [
      { type: "weapon", damage: 6 },
      { type: "price", price: 5 },
    ],
  },
  {
    id: "f089642d-1ae1-4fa2-b789-8884403e31d7",
    name: "War Hammer",
    tags: [
      { type: "bulky" },
      { type: "weapon", damage: 10 },
      { type: "price", price: 20 },
    ],
  },
  {
    id: "20b9b8ef-0981-4385-abb1-128d101942ff",
    name: "Mace",
    tags: [
      { type: "weapon", damage: 8 },
      { type: "price", price: 10 },
    ],
  },
  {
    id: "3fef7a80-61ee-4ed0-99f0-bd459382621c",
    name: "Whip",
    tags: [
      { type: "weapon", damage: 6 },
      { type: "price", price: 5 },
    ],
  },
  {
    id: "6382d4d1-33c2-4dd5-a1c9-b37c94270170",
    name: "Cestus",
    tags: [
      { type: "weapon", damage: 6 },
      { type: "price", price: 5 },
    ],
  },
  {
    id: "dec37db2-a843-4fb4-b283-d061d525e6a0",
    name: "Sling",
    tags: [
      { type: "weapon", damage: 4 },
      { type: "price", price: 5 },
    ],
  },
  {
    id: "96f3eab6-e56c-455a-b086-6769b8ccecd2",
    name: "Cudgel",
    tags: [
      { type: "weapon", damage: 6 },
      { type: "price", price: 5 },
    ],
  },
  {
    id: "7d93949b-b1db-430e-a117-aef1404c26f5",
    name: "Axe",
    tags: [
      { type: "weapon", damage: 8 },
      { type: "price", price: 10 },
    ],
  },
  {
    id: "758b7ee8-d675-4d2a-90db-0c157d779016",
    name: "Polearm",
    tags: [
      { type: "bulky" },
      { type: "weapon", damage: 10 },
      { type: "price", price: 20 },
    ],
  },
  {
    id: "7d162b24-d72b-4c57-8a9d-cc05833e1dff",
    name: "Flail",
    tags: [
      { type: "weapon", damage: 8 },
      { type: "price", price: 10 },
    ],
  },
  {
    id: "b8aca06e-5ae3-46e1-a21d-353465ca356a",
    name: "Bolas",
    tags: [{ type: "weapon", damage: 6 }],
  },
  {
    id: "91ce41a3-571b-4b00-9dcd-1f03531d2ac7",
    name: "Halberd",
    tags: [
      { type: "bulky" },
      { type: "weapon", damage: 10 },
      { type: "price", price: 20 },
    ],
  },
  {
    id: "b0a78bb3-c6ae-4441-9fdb-67ac25bc4f3b",
    name: "Blowgun",
    tags: [{ type: "weapon", damage: 6 }],
  },
  {
    id: "912240bc-b1a4-4a94-822e-2b7f2bd2069c",
    name: "Staff",
    tags: [
      { type: "weapon", damage: 6 },
      { type: "price", price: 5 },
    ],
  },
  {
    id: "b614d3c5-20f0-42a2-8287-ffa9508ec136",
    name: "Long Sword",
    tags: [
      { type: "bulky" },
      { type: "weapon", damage: 10 },
      { type: "price", price: 20 },
    ],
  },
  {
    id: "e8dd2602-64d0-4650-b821-d81b83129a94",
    name: "Bow",
    tags: [
      { type: "bulky" },
      { type: "weapon", damage: 6 },
      { type: "price", price: 20 },
    ],
  },
  {
    id: "f38322ba-cbcc-48c1-8cd7-cf0ad332d344",
    name: "Broadsword",
    tags: [
      { type: "weapon", damage: 8 },
      { type: "price", price: 10 },
    ],
  },
  {
    id: "dfb42206-9e61-4ae8-8f01-d5c3b1e11b8b",
    name: "Crossbow",
    tags: [
      { type: "bulky" },
      { type: "weapon", damage: 8 },
      { type: "price", price: 30 },
    ],
  },
  {
    id: "be403893-e9ca-4986-9d71-9a966bff01eb",
    name: "Dart",
    tags: [{ type: "weapon", damage: 6 }],
  },
  {
    id: "058edaa9-e8f5-4843-aca1-46d7b226a396",
    name: "Javelin",
    tags: [{ type: "bulky" }, { type: "weapon", damage: 10 }],
  },
];
