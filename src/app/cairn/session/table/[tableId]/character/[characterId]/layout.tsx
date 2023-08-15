"use client";

import {
  PlayerConnectionContextProvider,
  useCurrentCharacter,
} from "@/app/cairn/cairn-context";
import { useParams } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { tableId } = params;
  const { state: character } = useCurrentCharacter();
  return (
    <PlayerConnectionContextProvider
      sessionCode={tableId}
      character={character}
    >
      {children}
    </PlayerConnectionContextProvider>
  );
}
