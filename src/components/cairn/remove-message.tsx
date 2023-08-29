import { CairnMessage } from "@/lib/game/cairn/types";
import { Button } from "../ui/button";
import { useGmConnectionContext } from "@/app/cairn-context";
import { AllChatMessage } from "@/lib/network/types";

interface Props {
  filter(m: AllChatMessage<CairnMessage>): boolean;
}

export function RemoveMessage({ filter }: Props) {
  const { removeMessage } = useGmConnectionContext();
  return (
    <Button
      onClick={() => {
        removeMessage(filter);
      }}
    >
      Remove
    </Button>
  );
}
