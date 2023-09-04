import { DiceRollAnalysis } from "@/lib/dice/types";
import { StrongEmph } from "./typography";

interface Props {
  results: DiceRollAnalysis;
}

export function DiceRoll({ results }: Props) {
  if (results.pool.number > 1) {
    return (
      <span className="inline-flex gap-2">
        {results.results.map(({ value, valid }, i) =>
          valid ? <StrongEmph key={i}>{value}</StrongEmph> : <span key={i}>{value}</span>
        )}
      </span>
    );
  } else {
    return <StrongEmph>{results.rollValue}</StrongEmph>;
  }
}
