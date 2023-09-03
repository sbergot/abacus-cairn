import {
  useLoggerContext,
  CurrentCharacterContextProvider,
  useCurrentCharacter,
} from "@/app/cairn-context";
import { CairnCharacter, CairnCharacterBase, CairnMessage } from "@/lib/game/cairn/types";
import { getDamages } from "@/lib/game/cairn/utils";
import { roll } from "@/lib/random";
import { ILens } from "@/lib/types";
import { getSubArrayLens } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { DeleteAlert } from "../ui/delete-alert";
import { CharacterDescriptionDialog } from "./character-description-dialog";
import { CharacterInventoryDialog } from "./character-inventory-dialog";
import { TitleWithIcons } from "../ui/title-with-icons";
import { CharacterStats } from "./character-stats";
import { EditCharStats } from "./edit-char-stats";
import { CharacterProp } from "@/lib/game/types";
import { CardMenu } from "../ui/card-menu";
import { MenuEntry } from "../ui/menu-entry";
import { CardHeaderWithMenu } from "../ui/card-header-with-menu";
import { Logger } from "@/lib/network/types";

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
                  <DeleteAlert
                    icon={
                      <Button
                        variant="ghost"
                        size="xs"
                        className="flex gap-2 w-full"
                      >
                        <Trash2Icon />
                        <div className="flex-grow text-left">Delete</div>
                      </Button>
                    }
                    onConfirm={() =>
                      lens.setState((d) => d.filter((n) => n.id !== npc.id))
                    }
                  >
                    This will permanently delete this {charType}
                  </DeleteAlert>
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
  return <div>
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
}