import { useCurrentCharacter } from "@/app/cairn-context";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { Button } from "../ui/button";
import { clone } from "@/lib/utils";

interface Props {
  npc: CairnCharacter;
}

export function InviteNpc({ npc }: Props) {
  const lens = useCurrentCharacter();

  return (
    <Button
      onClick={() => {
        lens.setState((d) => {
          d.hireLings.push(clone(npc));
        });
      }}
    >
      Invite
    </Button>
  );
}
