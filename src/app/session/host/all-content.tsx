import { useCurrentGame } from "@/app/cairn-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getSubArrayLens,
  getSubLens,
  uuidv4,
} from "@/lib/utils";
import { ManageCustomItems } from "./manage-custom-items";
import { AllItems } from "./game-items";
import { AllNpcs } from "./game-npcs";
import { AllEntriesForCategory } from "./game-custom-categories";
import { NewCategoryDialog } from "./new-category-dialog";

export function AllContent() {
  const gameLens = useCurrentGame();
  const customCategoriesLens = getSubLens(gameLens, "customEntries");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <NewCategoryDialog
          onCreate={(name) =>
            gameLens.setState((d) => {
              d.customEntries.push({
                id: uuidv4(),
                name,
                description: "",
                entries: [],
              });
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
        {customCategoriesLens.state.map((category, idx) => {
          const categoryLens = getSubArrayLens(customCategoriesLens, idx);
          const entriesLens = getSubLens(categoryLens, "entries");
          const categoryName = categoryLens.state.name;
          return (
            <AccordionItem key={category.id} value={category.name}>
              <AccordionTrigger>{category.name}</AccordionTrigger>
              <AccordionContent>
                <AllEntriesForCategory
                  categoryLens={entriesLens}
                  category={categoryName}
                  onDeleteCategory={() =>
                    gameLens.setState((d) => {
                      d.customEntries = d.customEntries.filter(
                        (c) => c.id !== categoryLens.state.id
                      );
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
