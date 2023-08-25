import {
  useLoggerContext,
  CurrentCharacterContextProvider,
} from "@/app/cairn-context";
import { CairnCharacter } from "@/lib/game/cairn/types";
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
import { TitleWithIcons } from "./title-with-icons";
import { CharacterStats } from "./character-stats";
import { EditCharStats } from "./edit-char-stats";
import { TooltipShort } from "../ui/tooltip-short";

interface CharacterCollectionProps<TChar extends CairnCharacter> {
  charType: string;
  lens: ILens<TChar[]>;
  HeaderMenu({ characterLens }: { characterLens: ILens<TChar> }): ReactNode;
  Edit({ characterLens }: { characterLens: ILens<TChar> }): ReactNode;
  Details({ characterLens }: { characterLens: ILens<TChar> }): ReactNode;
}

export function CharacterCollection<TChar extends CairnCharacter>({
  charType,
  lens,
  HeaderMenu,
  Edit,
  Details,
}: CharacterCollectionProps<TChar>) {
  const log = useLoggerContext();
  return (
    <div className="flex flex-col gap-2 items-start">
      {lens.state.map((npc, idx) => {
        const charLens: ILens<TChar> = getSubArrayLens(lens, idx);
        return (
          <CurrentCharacterContextProvider key={npc.id} value={charLens}>
            <Card>
              <CardHeader>
                <TitleWithIcons name={npc.name}>
                  <TooltipShort name="Edit stats">
                    <EditCharStats>
                      <Edit characterLens={charLens} />
                    </EditCharStats>
                  </TooltipShort>
                  <TooltipShort name="View details">
                    <CharacterDescriptionDialog>
                      <Details characterLens={charLens} />
                    </CharacterDescriptionDialog>
                  </TooltipShort>
                  <TooltipShort name="View inventory">
                    <CharacterInventoryDialog />
                  </TooltipShort>
                  <TooltipShort name="Delete">
                    <DeleteAlert
                      icon={
                        <Button variant="ghost" size="icon-sm">
                          <Trash2Icon />
                        </Button>
                      }
                      onConfirm={() =>
                        lens.setState((d) => d.filter((n) => n.id !== npc.id))
                      }
                    >
                      This will permanently delete this {charType}
                    </DeleteAlert>
                  </TooltipShort>
                  <HeaderMenu characterLens={charLens} />
                </TitleWithIcons>
              </CardHeader>
              <CardContent>
                <CharacterStats />
                <div>
                  {charLens.state.inventory.map((s) =>
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
              </CardContent>
            </Card>
          </CurrentCharacterContextProvider>
        );
      })}
    </div>
  );
}
