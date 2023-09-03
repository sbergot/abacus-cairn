import { LibraryElement } from "@/lib/game/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";

interface Props {
  elements: Record<string, LibraryElement[]>;
}

export function RevealedElements({ elements }: Props) {
  return (
    <Accordion type="multiple" defaultValue={Object.keys(elements)}>
      {Object.keys(elements).map((category) => (
        <AccordionItem key={category} value={category}>
          <AccordionTrigger>{category}</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 w-full">
              {elements[category].map((entry, i) => {
                return (
                  <Card key={i} className="max-w-xs w-full">
                    <CardHeader className="flex justify-between flex-row items-center gap-2">
                      <CardTitle className="flex-grow">{entry.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>{entry.description}</div>
                      {entry.gauge !== undefined && (
                        <Progress
                          value={(entry.gauge.current * 100) / entry.gauge.max}
                        />
                      )}
                    </CardContent>
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
