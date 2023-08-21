import { LibraryElement } from "@/lib/game/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface Props {
  elements: Record<string, LibraryElement[]>;
}

export function RevealedElements({ elements }: Props) {
  return (
    <Accordion type="multiple">
      {Object.keys(elements).map((category) => (
        <AccordionItem value={category}>
          <AccordionTrigger>{category}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 w-full">
              {elements[category].map((entry) => {
                return (
                  <Card>
                    <CardHeader className="flex justify-between flex-row items-center gap-2">
                      <CardTitle className="flex-grow">{entry.name}</CardTitle>
                    </CardHeader>
                    <CardContent>{entry.description}</CardContent>
                  </Card>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
