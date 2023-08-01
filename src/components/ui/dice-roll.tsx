import { StrongEmph } from "./typography";

interface Props {
  results: DiceRollAnalysis;
}

export function DiceRoll({ results }: Props) {
  if (results.pool.number > 1) {
    return (
      <span className="inline-flex gap-2">
        {results.results.map(({ value, valid }) =>
          valid ? <StrongEmph>{value}</StrongEmph> : <span>{value}</span>
        )}
      </span>
    );
  } else {
    return <StrongEmph>{results.rollValue}</StrongEmph>;
  }
}
