"use client";

import { PlayerConnectionStubContextProvider } from "@/app/cairn-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerConnectionStubContextProvider>
      {children}
    </PlayerConnectionStubContextProvider>
  );
}
