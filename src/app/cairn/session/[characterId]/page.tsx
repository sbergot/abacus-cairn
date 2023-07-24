import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import { Character } from "@/lib/game/cairn/types";
import { useCharacterStorage } from "@/lib/hooks";
import { Ability } from "../../ability";
import { Title } from "@/components/ui/title";
import { TwoColumns } from "@/components/generic-pages/two-columns";

function CharacterSheet({ character }: { character: Character }) {
    return <div className="flex flex-col gap-4 max-w-sm mx-auto">
      <Title>Attributes</Title>
      <div className="flex gap-8">
        <div className="max-w-min">
          <Ability name="Strength" value={character.strength.max} />
          <Ability name="Dexterity" value={character.dexterity.max} />
          <Ability name="Willpower" value={character.willpower.max} />
        </div>
        <div className="max-w-min">
          <Ability name="HP" value={character.hp.max} />
          <Ability name="Armor" value={1} />
        </div>
      </div>
    </div>
}

export default function Session({
  params,
}: {
  params: { characterId: string };
}) {
  const [characters, setCharacters] = useCharacterStorage<Character>();
  const character = characters[params.characterId];
  <TwoColumns leftPart={<CharacterSheet character={character} />} rightPart={"hello"} />
}
