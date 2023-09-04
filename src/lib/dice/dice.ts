import { DicePool, DiceRoll, DiceRollAnalysis } from "./types";

export function simpleRoll(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function poolRoll({ number, sides }: DicePool): DiceRoll {
  let results = [];
  for (let i = 0; i < number; i++) {
    results.push(simpleRoll(sides));
  }
  return { results };
}

export function pickRandom<T>(source: T[]): T {
  return source[simpleRoll(source.length) - 1];
}

export function sumRoll(pool: DicePool): DiceRollAnalysis {
  const { results } = poolRoll(pool);
  return {
    pool,
    results: results.map(r => ({ value: r, valid: true })),
    rollValue: results.reduce((acc, r) => acc + r, 0)
  }
}

export function maxRoll(pool: DicePool): DiceRollAnalysis {
  const { results } = poolRoll(pool);
  const maxValue = Math.max(...results);
  return {
    pool,
    results: results.map(r => ({ value: r, valid: r === maxValue })),
    rollValue: maxValue
  }
}

export function minRoll(pool: DicePool): DiceRollAnalysis {
  const { results } = poolRoll(pool);
  const minValue = Math.min(...results);
  return {
    pool,
    results: results.map(r => ({ value: r, valid: r === minValue })),
    rollValue: minValue
  }
}