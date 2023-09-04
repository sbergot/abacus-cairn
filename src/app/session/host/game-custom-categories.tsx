import { Card, CardContent } from "@/components/ui/card";
import { CardHeaderWithMenu } from "@/components/ui/card-header-with-menu";
import { DeleteMenuItem } from "@/components/ui/delete-menu-item";
import { EditCustomEntryDialog } from "@/components/ui/edit-custom-entry-dialog";
import { GmContentMenuItems } from "@/components/ui/gm-content-menu-items";
import { MenuEntry } from "@/components/ui/menu-entry";
import { NewCustomEntryDialog } from "@/components/ui/new-custom-entry-dialog";
import { WeakEmph } from "@/components/ui/typography";
import { CustomEntry } from "@/lib/game/types";
import { ILens } from "@/lib/types";
import { getSubArrayLens } from "@/lib/utils";
import { RandomEntryDialog } from "./random-entry-dialog";
import { BackLink } from "./back-link";

interface AllEntriesForCategoryProps {
  categoryLens: ILens<CustomEntry[]>;
  category: string;
}

export function AllEntriesForCategory({
  categoryLens,
  category,
}: AllEntriesForCategoryProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <BackLink />
        <NewCustomEntryDialog
          onCreate={(ce) =>
            categoryLens.setState((d) => {
              d.push(ce);
            })
          }
        />
        <RandomEntryDialog lens={categoryLens} name={category} />
      </div>
      <div className="flex flex-wrap gap-2 w-full">
        {categoryLens.state.map((entry, idx) => {
          const entryLens = getSubArrayLens(categoryLens, idx);
          return (
            <Card key={entry.id} className="max-w-xs w-full">
              <CustomEntryHeader
                categoryLens={categoryLens}
                entryLens={entryLens}
                category={category}
              />
              <CardContent>
                <div>{entry.description}</div>
                <WeakEmph>{entry.privateNotes}</WeakEmph>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

interface CustomEntryHeaderProps {
  entryLens: ILens<CustomEntry>;
  categoryLens: ILens<CustomEntry[]>;
  category: string;
}

function CustomEntryHeader({
  entryLens,
  categoryLens,
  category,
}: CustomEntryHeaderProps) {
  const entry = entryLens.state;
  return (
    <CardHeaderWithMenu title={entry.name}>
      <MenuEntry>
        <EditCustomEntryDialog lens={entryLens} title={`Edit ${category}`} />
      </MenuEntry>
      <GmContentMenuItems lens={entryLens} />
      <MenuEntry>
        <DeleteMenuItem
          collectionLens={categoryLens}
          entry={entry}
          type={category}
        />
      </MenuEntry>
    </CardHeaderWithMenu>
  );
}
