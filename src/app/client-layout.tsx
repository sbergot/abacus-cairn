"use client";

import { Button } from "@/components/ui/button";
import { GameContextProvider } from "./cairn-context";
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
        <span className="mr-2">Cairn is a tabletop rpg by Yochai Gal</span>-
        <HeaderLink text="cairnrpg.com" href="https://cairnrpg.com" />
        -
        <HeaderLink
          text="report a bug"
          href="https://github.com/sbergot/abacus/issues"
        />
      </div>
      <TooltipProvider>
        <GameContextProvider>{children}</GameContextProvider>
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
    <Button variant="link" className="p-0 mx-2" asChild>
      <Link href={href}>{text}</Link>
    </Button>
  );
}
