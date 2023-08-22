import { useCurrentCharacter } from "@/app/cairn-context";
import NumberField from "../ui/numberfield";

export function CharacterCoins() {
  return <div className="flex gap-4">
  <CoinControl type="gold" />
  <CoinControl type="silver" />
  <CoinControl type="copper" />
</div>
}

type CoinType = "gold" | "silver" | "copper";

interface CoinControlProps {
  type: CoinType;
}

function CoinControl({ type }: CoinControlProps) {
  const lens = useCurrentCharacter();
  return (
    <div className="flex gap-2">
      <div>{type}</div>
      <NumberField className="w-20 h-7" lens={lens} fieldName={type} />
    </div>
  );
}