import { CharacterStatsView } from "@/components/cairn/character-stats-view";
import { Title } from "@/components/ui/typography";
import { CairnCharacter } from "@/lib/game/cairn/types";

interface CharacterEntryProps {
  character: CairnCharacter;
}

export function CharacterEntry({ character }: CharacterEntryProps) {
  return (
    <div className="flex flex-col gap-4 max-w-full items-start">
      <Title>{character.name}</Title>
      <CharacterStatsView character={character} />
    </div>
  );
}
