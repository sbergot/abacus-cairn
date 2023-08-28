import { Gear } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import CheckboxField from "../ui/checkboxfield";
import NumberField from "../ui/numberfield";
import TextField from "../ui/textfield";
import { ArmorSelect } from "./armor-select";
import { DiceSelect } from "./dice-select";

interface GearEditProps {
  lens: ILens<Gear>;
}

export function GearEdit({ lens }: GearEditProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div>Name</div>
        <TextField lens={lens} fieldName="name" />
      </div>
      <div className="flex gap-2">
        <div>
          <DiceSelect
            allowNoAttack
            dice={lens.state.damage}
            setDice={(v) =>
              lens.setState((d) => {
                d.damage = v;
              })
            }
          />
        </div>
        <div>
          <ArmorSelect
            allowNoArmor
            armor={lens.state.armor}
            setArmor={(v) =>
              lens.setState((d) => {
                d.armor = v;
              })
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <div>bulky</div> <CheckboxField lens={lens} fieldName="bulky" />
        </div>
        <div className="flex items-center gap-2">
          <div>blast</div> <CheckboxField lens={lens} fieldName="blast" />
        </div>
      </div>
      <div>
        <div>Price</div>
        <NumberField lens={lens} fieldName="price" />
      </div>
    </div>
  );
}