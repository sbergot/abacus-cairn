"use client";

import { Button } from "@/components/ui/button";
import { GameContextProvider } from "./cairn-context";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mt-2 pl-4">
        <h1 className="text-4xl">
          <a href="/">Cairn</a>
        </h1>
        <span className="mr-2">Cairn is a tabletop rpg by Yochai Gal</span>
        -
        <Button variant="link" className="p-0 mx-2" asChild>
          <a href="https://cairnrpg.com">
          cairnrpg.com
          </a>
        </Button>
        -
        <Button variant="link" className="p-0 mx-2" asChild>
        <a
          className="link"
          href="https://github.com/sbergot/abacus/issues"
        >
          report a bug
        </a>
        </Button>
      </div>
      <GameContextProvider>
        {children}
      </GameContextProvider>
    </div>
  );
}
