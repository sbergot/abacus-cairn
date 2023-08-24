import { Gear } from "@/lib/game/cairn/types";

interface ShowGearProps {
  gear: Gear;
}

export function ShowGear({ gear }: ShowGearProps) {
  const descr: string[] = [];
  if (gear.damage !== undefined) {
    descr.push(`d${gear.damage} damage`);
  }
  if (gear.bulky) {
    descr.push("bulky");
  }
  if (gear.blast) {
    descr.push("blast");
  }
  if (gear.armor !== undefined) {
    descr.push(`${gear.armor} Armor`);
  }
  if (gear.charges !== undefined) {
    descr.push(`${gear.charges.current}/${gear.charges.max} Charges`);
  }

  const tagDescr = descr.length > 0 ? ` (${descr.join(", ")})` : "";
  return gear.name + tagDescr;
}
