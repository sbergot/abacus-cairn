export interface DicePool {
  number: number;
  sides: number;
}

export interface DiceRoll {
  results: number[];
}

export interface QualifiedResult {
  value: number;
  valid: boolean;
}

export interface DiceRollAnalysis {
  pool: DicePool;
  results: QualifiedResult[];
  rollValue: number;
}

