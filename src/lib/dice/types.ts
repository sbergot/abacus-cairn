interface DicePool {
  number: number;
  sides: number;
}

interface DiceRoll {
  results: number[];
}

interface QualifiedResult {
  value: number;
  valid: boolean;
}

interface DiceRollAnalysis {
  pool: DicePool;
  results: QualifiedResult[];
  rollValue: number;
}

