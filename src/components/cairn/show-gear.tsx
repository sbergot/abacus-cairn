import { Gear } from "@/lib/game/cairn/types";

interface ShowGearProps {
  gear: Gear;
}

export function ShowGear({ gear }: ShowGearProps) {
  const descr: string[] = [];
  gear.tags.forEach((t) => {
    if (t.type === "weapon") {
      descr.push(`d${t.damage} damage`);
    }
    if (t.type === "bulky") {
      descr.push("bulky");
    }
    if (t.type === "blast") {
      descr.push("blast");
    }
    if (t.type === "armor") {
      descr.push(`${t.armor} Armor`);
    }
    if (t.type === "shield") {
      descr.push(`+${t.armor} Armor`);
    }
    if (t.type === "relic") {
      descr.push(`${t.charges} Charges`);
    }
  });

  const tagDescr = descr.length > 0 ? ` (${descr.join(", ")})` : "";
  return gear.name + tagDescr;
}
