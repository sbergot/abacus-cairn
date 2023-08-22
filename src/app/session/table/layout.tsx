"use client";

import {
  PlayerConnectionContextProvider,
  useCurrentCharacter,
} from "@/app/cairn-context";
import { useUrlParams } from "@/lib/hooks";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useUrlParams();
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
