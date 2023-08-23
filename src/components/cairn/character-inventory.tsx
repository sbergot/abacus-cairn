import { useCurrentCharacter } from "@/app/cairn-context";
import { InventoryControl } from "./inventory-control";
import { getSubLens } from "@/lib/utils";

interface Props {
  shopLink(slotId: string): string;
}

export function CharacterInventory({ shopLink }: Props) {
  const lens = useCurrentCharacter();

  return (
    <InventoryControl
      shopLink={shopLink}
      slotsLens={getSubLens(lens, "inventory")}
    />
  );
}
