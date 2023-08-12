"use client";

import { PlayerConnectionContextProvider } from "@/app/cairn/cairn-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerConnectionContextProvider>
      {children}
    </PlayerConnectionContextProvider>
  );
}
