import {
  useLoggerContext,
  CurrentCharacterContextProvider,
  useCurrentCharacter,
} from "@/app/cairn-context";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { getDamages } from "@/lib/game/cairn/utils";
import { roll } from "@/lib/random";
import { ILens } from "@/lib/types";
import { getSubArrayLens } from "@/lib/utils";
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

interface CharacterCollectionProps<TChar extends CairnCharacter> {
  charType: string;
  lens: ILens<TChar[]>;
  HeaderMenu({ characterLens }: CharacterProp<TChar>): ReactNode;
  Edit({ characterLens }: CharacterProp<TChar>): ReactNode;
  Details({ characterLens }: CharacterProp<TChar>): ReactNode;
}

export function CharacterCollection<TChar extends CairnCharacter>({
  charType,
  lens,
  HeaderMenu,
  Edit,
  Details,
}: CharacterCollectionProps<TChar>) {
  return (
    <div className="flex flex-col gap-2 items-start">
      {lens.state.map((npc, idx) => {
        const charLens: ILens<TChar> = getSubArrayLens(lens, idx);
        return (
          <CurrentCharacterContextProvider key={npc.id} value={charLens}>
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
  );
}

function CharacterAttacks() {
  const lens = useCurrentCharacter();
  const log = useLoggerContext();
  const character = lens.state;
  return (
    <div>
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
                  dice: getDamages(s),
                  result: roll(1, getDamages(s)),
                },
              })
            }
          >
            {s.state.gear.name} (d{s.state.gear.damage})
          </Button>
        ) : null
      )}
    </div>
  );
}
