import { useCurrentGame } from "@/app/cairn/cairn-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AllTables() {
  return (
    <div>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="npcs">
          <AccordionTrigger>NPCs</AccordionTrigger>
          <AccordionContent>
            <AllNpcs />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function AllNpcs() {
  const gameLens = useCurrentGame();
  return <div>
  </div>;
}
