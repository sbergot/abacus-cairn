import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type DiceType = undefined | 4 | 6 | 8 | 10 | 12;

interface Props {
  dice: number | undefined;
  setDice(n: number | undefined): void;
  allowNoAttack?: boolean;
}

export function DiceSelect({ dice, setDice, allowNoAttack }: Props) {
  return (
    <Select
      value={dice ? dice.toString() : ""}
      onValueChange={(v) =>  setDice(v ? Number(v) as DiceType : undefined)}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="dice" />
      </SelectTrigger>
      <SelectContent>
        {allowNoAttack && <SelectItem value="" className="w-32">no attack</SelectItem>}
        {[4, 6, 8, 10, 12].map((d) => (
          <SelectItem key={d} value={d.toString()} className="w-32">
            d{d} damage
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
