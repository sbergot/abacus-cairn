import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ArmorType = undefined | 1 | 2 | 3;

interface Props {
  armor: number | undefined;
  setArmor(n: number | undefined): void;
  allowNoArmor?: boolean;
}

export function ArmorSelect({ armor, setArmor, allowNoArmor }: Props) {
  return (
    <Select
      value={armor ? armor.toString() : ""}
      onValueChange={(v) =>  setArmor(v ? Number(v) as ArmorType : undefined)}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="armor" />
      </SelectTrigger>
      <SelectContent>
        {allowNoArmor && <SelectItem value="" className="w-32">no armor</SelectItem>}
        {[1, 2, 3].map((d) => (
          <SelectItem key={d} value={d.toString()} className="w-32">
            {d} armor
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
