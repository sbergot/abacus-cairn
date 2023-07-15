"use client"

import { GameContextProvider } from "@/lib/gameContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GameContextProvider value={{ gameName: "cairn" }}>
      {children}
    </GameContextProvider>
  );
}
