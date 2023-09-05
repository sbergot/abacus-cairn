"use client";

import { Button } from "@/components/ui/button";
import {
  GameContextProvider,
} from "./cairn-context";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mt-2 pl-4">
        <h1 className="text-4xl">
          <Link href="/">Cairn</Link>
        </h1>
        <div>Cairn is a tabletop rpg by Yochai Gal</div>
        <div className="flex gap-1 items-center">
        <HeaderLink text="cairnrpg.com" href="https://cairnrpg.com" />
        -
        <HeaderLink
          text="features overview"
          href="overview"
        />
        -
        <HeaderLink
          text="report a bug"
          href="https://github.com/sbergot/abacus/issues"
        />
        </div>
      </div>
      <TooltipProvider>
        <GameContextProvider>
          {children}
        </GameContextProvider>
      </TooltipProvider>
      <Toaster />
    </div>
  );
}

interface LinkProps {
  text: string;
  href: string;
}

function HeaderLink({ text, href }: LinkProps) {
  return (
    <Button variant="link" size="xs" className="p-0" asChild>
      <Link href={href}>{text}</Link>
    </Button>
  );
}
