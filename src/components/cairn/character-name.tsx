import { Title } from "../ui/typography";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import { Children } from "../ui/types";

interface Props extends Children {
  lens: ILens<CairnCharacter>;
}

export function CharacterName({ lens, children }: Props) {
  const { state: character } = lens;
  return (
    <div className="flex">
      <Title>{character.name}</Title>
      {children}
    </div>
  );
}
