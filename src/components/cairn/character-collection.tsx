import { useLoggerContext, CurrentCharacterContextProvider } from "@/app/cairn-context";
import { initCharacter, getRandomName } from "@/lib/game/cairn/character-generation";
import { CairnCharacter, CairnNpc } from "@/lib/game/cairn/types";
import { getDamages } from "@/lib/game/cairn/utils";
import { roll } from "@/lib/random";
import { ILens } from "@/lib/types";
import { getSubArrayLens } from "@/lib/utils";
import { UserPlusIcon, Trash2Icon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { DeleteAlert } from "../ui/delete-alert";
import { CharacterDescriptionDialog } from "./character-description";
import { CharacterInventoryDialog } from "./character-inventory-dialog";
import { CharacterName } from "./character-name";
import { CharacterStats } from "./character-stats";
import { EditCharStats } from "./edit-char-stats";

interface CharacterCollectionProps<TChar extends CairnCharacter> {
  lens: ILens<TChar[]>;
  Tools({ characterLens }: { characterLens: ILens<TChar> }): ReactNode;
}

export function CharacterCollection<TChar extends CairnCharacter>({
  lens, Tools
}: CharacterCollectionProps<TChar>) {
  const log = useLoggerContext();
  return (
    <div className="flex flex-col gap-2 items-start">
      <Button
        onClick={() =>
          lens.setState((d) => {
            const newNpc: TChar = {
              ...initCharacter(),
              visibleToAll: false,
              excludedFromRandomPick: false,
            };
            newNpc.strength = { current: 10, max: 10 };
            newNpc.dexterity = { current: 10, max: 10 };
            newNpc.willpower = { current: 10, max: 10 };
            newNpc.name = getRandomName();
            d.push(newNpc);
          })
        }
      >
        <UserPlusIcon className="mr-2" /> New npc
      </Button>
      {lens.state.map((npc, idx) => {
        const npcLens: ILens<CairnNpc> = getSubArrayLens(lens, idx);
        return (
          <CurrentCharacterContextProvider key={npc.id} value={npcLens}>
            <Card>
              <CardHeader>
                <CharacterName>
                  <EditCharStats />
                  <CharacterDescriptionDialog />
                  <CharacterInventoryDialog />
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
                    This will permanently delete this npc
                  </DeleteAlert>
                  <Tools characterLens={} />
                </CharacterName>
              </CardHeader>
              <CardContent>
                <CharacterStats />
                <div>
                  {npcLens.state.inventory.map((s) =>
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
