import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import { Title } from "../ui/typography";
import { EditCharStats } from "./edit-char-stats";
import { GenericRolls } from "./generic-rolls";

export function CharacterName() {
  const { state: character } = useCurrentCharacter();
  return (
    <div className="flex">
      <Title>{character.name}</Title>
      <EditCharStats />
      <GenericRolls />
    </div>
  );
}
