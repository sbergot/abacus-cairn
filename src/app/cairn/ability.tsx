interface AbilityProps {
  name: string;
  value: number;
}

export function Ability({ name, value }: AbilityProps) {
  return (
    <div className="flex gap-4 justify-between">
      <div>{name}</div> <div>{value}</div>
    </div>
  );
}
