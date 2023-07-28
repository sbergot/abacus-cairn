"use client";

import { PlayerConnectionContextProvider } from "../../cairn-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerConnectionContextProvider>
      {children}
    </PlayerConnectionContextProvider>
  );
}
