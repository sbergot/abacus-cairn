"use client";

import { Title } from "@/components/ui/typography";
import { useCharacterCreationContext } from "../character-creation-context";
import TextField from "@/components/ui/textfield";

export default function RollTraits() {
  const { lens } = useCharacterCreationContext();
  return (
    <div className="flex flex-col items-start gap-4 max-w-sm pl-4">
      <Title>Traits</Title>
      <TextField lens={lens} fieldName="description" />
    </div>
  );
}
