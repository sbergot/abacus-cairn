export interface Ability {
  current: number;
  max: number;
}

export interface Character {
  name: string;
  background: string;
  strength: Ability;
  dexterity: Ability;
  willpower: Ability;
  hp: Ability;
}