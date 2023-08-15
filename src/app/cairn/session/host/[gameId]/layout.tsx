"use client";

import { GmConnectionContextProvider } from "@/app/cairn/cairn-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GmConnectionContextProvider>
      {children}
    </GmConnectionContextProvider>
  );
}
