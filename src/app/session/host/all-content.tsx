import { useCurrentGame } from "@/app/cairn-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSubLens, getSubRecordLens } from "@/lib/utils";
import { ManageCustomItems } from "./manage-custom-items";
import { AllItems } from "./game-items";
import { AllNpcs } from "./game-npcs";
import { AllEntriesForCategory } from "./game-custom-categories";
import { NewCategoryDialog } from "./new-category-dialog";

export function AllContent() {
  const gameLens = useCurrentGame();
  const customEntriesLens = getSubLens(gameLens, "customEntries");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <NewCategoryDialog
          onCreate={(name) =>
            gameLens.setState((d) => {
              d.customEntries[name] = [];
            })
          }
        />
        <ManageCustomItems />
      </div>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "npcs",
          "items",
          ...Object.keys(gameLens.state.customEntries),
        ]}
      >
        <AccordionItem value="npcs">
          <AccordionTrigger>NPCs</AccordionTrigger>
          <AccordionContent>
            <AllNpcs />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="items">
          <AccordionTrigger>Items</AccordionTrigger>
          <AccordionContent>
            <AllItems />
          </AccordionContent>
        </AccordionItem>
        {Object.keys(customEntriesLens.state).map((category) => {
          const categoryLens = getSubRecordLens(customEntriesLens, category);
          return (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent>
                <AllEntriesForCategory
                  categoryLens={categoryLens}
                  category={category}
                  onDeleteCategory={() =>
                    gameLens.setState((d) => {
                      delete d.customEntries[category];
                    })
                  }
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
