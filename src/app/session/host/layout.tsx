"use client";

import { GmConnectionContextProvider } from "@/app/cairn-context";
import { TimerProvider } from "@/app/timer-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GmConnectionContextProvider>
      <TimerProvider>{children}</TimerProvider>
    </GmConnectionContextProvider>
  );
}
