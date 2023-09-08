import {
  useLoggerContext,
  CurrentCharacterContextProvider,
  useCurrentCharacter,
} from "@/app/cairn-context";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { getDamageDiceNbr, getDamages } from "@/lib/game/cairn/utils";
import { ILens } from "@/lib/types";
import { getSubArrayLensById } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CharacterDescriptionDialog } from "./character-description-dialog";
import { CharacterInventoryDialog } from "./character-inventory-dialog";
import { CharacterStats } from "./character-stats";
import { EditCharStats } from "./edit-char-stats";
import { CharacterProp } from "@/lib/game/types";
import { MenuEntry } from "../ui/menu-entry";
import { CardHeaderWithMenu } from "../ui/card-header-with-menu";
import { DeleteMenuItem } from "../ui/delete-menu-item";
import { WeakEmph } from "../ui/typography";
import { maxRoll } from "@/lib/dice/dice";

interface CharacterCollectionProps<TChar extends CairnCharacter> {
  charType: string;
  lens: ILens<TChar[]>;
  searchFilter?: string;
  HeaderMenu({ characterLens }: CharacterProp<TChar>): ReactNode;
  Edit({ characterLens }: CharacterProp<TChar>): ReactNode;
  Details({ characterLens }: CharacterProp<TChar>): ReactNode;
}

export function CharacterCollection<TChar extends CairnCharacter>({
  charType,
  lens,
  searchFilter,
  HeaderMenu,
  Edit,
  Details,
}: CharacterCollectionProps<TChar>) {
  let charList = lens.state;
  if (searchFilter) {
    charList = lens.state.filter((i) =>
      i.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }
  return (
    <>
      {charList.length > 20 && (
        <WeakEmph>Results limited to the first 20 entries</WeakEmph>
      )}

      <div className="flex flex-col gap-2 items-start">
        {charList
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20)
          .map((npc) => {
            const charLens: ILens<TChar> = getSubArrayLensById(lens, npc.id);
            return (
              <CurrentCharacterContextProvider
                key={npc.id}
                value={charLens as any as ILens<CairnCharacter>}
              >
                <Card>
                  <CardHeaderWithMenu title={npc.name}>
                    <MenuEntry>
                      <EditCharStats>
                        <Edit characterLens={charLens} />
                      </EditCharStats>
                    </MenuEntry>
                    <MenuEntry>
                      <CharacterDescriptionDialog>
                        <Details characterLens={charLens} />
                      </CharacterDescriptionDialog>
                    </MenuEntry>
                    <MenuEntry>
                      <CharacterInventoryDialog />
                    </MenuEntry>
                    <MenuEntry>
                      <DeleteMenuItem
                        collectionLens={lens}
                        entry={npc}
                        type={charType}
                      />
                    </MenuEntry>
                    <HeaderMenu characterLens={charLens} />
                  </CardHeaderWithMenu>
                  <CardContent>
                    <CharacterStats />
                    <CharacterAttacks />
                  </CardContent>
                </Card>
              </CurrentCharacterContextProvider>
            );
          })}
      </div>
    </>
  );
}

function CharacterAttacks() {
  const lens = useCurrentCharacter();
  const log = useLoggerContext();
  const character = lens.state;
  return (
    <div className="flex flex-wrap gap-1">
      {character.inventory.map((s) =>
        s.state.type === "gear" && s.state.gear.damage ? (
          <Button
            key={s.id}
            onClick={() =>
              log({
                kind: "chat-custom",
                type: "AttackRoll",
                title: "Attack roll",
                props: {
                  dice: { number: getDamageDiceNbr(s), sides: getDamages(s) },
                  result: maxRoll({ number: getDamageDiceNbr(s), sides: getDamages(s) }),
                },
              })
            }
          >
            {s.state.gear.name} ({s.state.gear.damageDiceNbr ?? ""}d{s.state.gear.damage})
          </Button>
        ) : null
      )}
    </div>
  );
}
