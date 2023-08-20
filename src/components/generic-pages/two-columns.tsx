"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface Props {
  leftPart: React.ReactNode;
  rightPart: React.ReactNode;
}

export function TwoColumns({ leftPart, rightPart }: Props) {
  const [isMessagePanelVisible, setIsMessagePanelVisible] = useState(false);
  const visibilityClasses = isMessagePanelVisible
    ? "opacity-100"
    : "opacity-0 invisible lg:opacity-100 lg:visible";
  return (
    <div className="ml-4">
      <div className="flex gap-2">
        <div className="max-w-2xl w-full">{leftPart}</div>
        <div
          className={`transition-all session-right-part ${visibilityClasses}`}
        >
          {rightPart}
        </div>
      </div>
      <div className="fixed right-8 bottom-8 print:invisible visible lg:invisible">
        <Button size="icon" onClick={() => setIsMessagePanelVisible((v) => !v)}>
          {isMessagePanelVisible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </div>
  );
}
