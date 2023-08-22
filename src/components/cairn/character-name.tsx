import { Title } from "../ui/typography";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import { Children } from "../ui/types";
import { useCurrentCharacter } from "@/app/cairn-context";

interface Props extends Children {
}

export function CharacterName({ children }: Props) {
  const { state: character } = useCurrentCharacter();
  return (
    <div className="flex">
      <Title>{character.name}</Title>
      {children}
    </div>
  );
}
