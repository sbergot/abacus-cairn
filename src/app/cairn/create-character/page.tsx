"use client";

import TextField from "@/components/ui/textfield";
import { Character } from "@/lib/game/cairn/types";
import { rollCharacter } from "@/lib/game/cairn/utils";
import { useForm } from "react-hook-form";
import { useImmer } from "use-immer";

export default function CreateCharacter() {
  const [char, setChar] = useImmer<Character>(rollCharacter());
  const form = useForm();
  return (
    <div>
      <div>Strength: {char.strength.max}</div>
      <div>Dexterity: {char.dexterity.max}</div>
      <div>Willpower: {char.willpower.max}</div>
      <TextField<Character> fieldName="name" setter={setChar} />
    </div>
  );
}
