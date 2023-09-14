import { Card, CardContent } from "@/components/ui/card";
import { CardHeaderWithMenu } from "@/components/ui/card-header-with-menu";
import { DeleteMenuItem } from "@/components/ui/delete-menu-item";
import { EditCustomEntryDialog } from "@/components/ui/edit-custom-entry-dialog";
import { GmContentMenuItems } from "@/components/ui/gm-content-menu-items";
import { MenuEntry } from "@/components/ui/menu-entry";
import { NewCustomEntryDialog } from "@/components/ui/new-custom-entry-dialog";
import { WeakEmph } from "@/components/ui/typography";
import { BaseCategory, CustomEntry } from "@/lib/game/types";
import { ILens } from "@/lib/types";
import { getSubArrayLensById, getSubLens } from "@/lib/utils";
import { RandomEntryDialog } from "./random-entry-dialog";
import { BackLink } from "./back-link";
import { SearchInput } from "@/components/ui/search-input";
import { useLens } from "@/lib/hooks";

interface AllEntriesForCategoryProps {
  categoryLens: ILens<BaseCategory<"misc", {}>>;
}

export function AllEntriesForCategory({
  categoryLens,
}: AllEntriesForCategoryProps) {
  const searchLens = useLens("");
  const entriesLens = getSubLens(categoryLens, "entries");
  const categoryName = categoryLens.state.name;
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <BackLink />
        <NewCustomEntryDialog
          onCreate={(ce) =>
            entriesLens.setState((d) => {
              d.push(ce);
            })
          }
        />
        <RandomEntryDialog lens={entriesLens} name={categoryName} />
        <SearchInput lens={searchLens} />
      </div>
      {entriesLens.state.length > 20 && (
        <WeakEmph>Results limited to the first 20 entries</WeakEmph>
      )}
      {entriesLens.state.length === 0 && <WeakEmph>No {categoryName} defined</WeakEmph>}
      {entriesLens.state.length > 0 && (
        <div className="flex flex-wrap gap-2 w-full">
          {entriesLens.state
            .filter((i) =>
              i.name.toLowerCase().includes(searchLens.state.toLowerCase())
            )
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .slice(0, 20)
            .map((entry) => {
              const entryLens = getSubArrayLensById(entriesLens, entry.id);
              return (
                <Card key={entry.id} className="max-w-xs w-full">
                  <CustomEntryHeader
                    categoryLens={entriesLens}
                    entryLens={entryLens}
                    category={categoryName}
                  />
                  <CardContent>
                    <div>{entry.description}</div>
                    <WeakEmph>{entry.privateNotes}</WeakEmph>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
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
      <GmContentMenuItems lens={entryLens} categoryType="misc" />
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
