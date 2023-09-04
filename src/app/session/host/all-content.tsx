import { useCurrentGame } from "@/app/cairn-context";
import { getSubArrayLens, getSubLens, uuidv4 } from "@/lib/utils";
import { ManageCustomItems } from "./manage-custom-items";
import { AllItems } from "./game-items";
import { AllNpcs } from "./game-npcs";
import { AllEntriesForCategory } from "./game-custom-categories";
import { NewCategoryDialog } from "./new-category-dialog";
import { Card, CardHeader } from "@/components/ui/card";
import { TitleWithIcons } from "@/components/ui/title-with-icons";
import { FolderOpenIcon, Trash2Icon } from "lucide-react";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { ButtonLike } from "@/components/ui/button-like";
import { useRelativeLinker, useUrlParams } from "@/lib/hooks";
import Link from "next/link";

interface CategoryLinkProps {
  name: string;
}

function CategoryLink({ name }: CategoryLinkProps) {
  const { gameId } = useUrlParams();
  const linker = useRelativeLinker();
  return (
    <Link href={linker(`?gameId=${gameId}&category=${name}`)}>
      <FolderOpenIcon />
    </Link>
  );
}

export function AllContent() {
  const { category } = useUrlParams();
  const gameLens = useCurrentGame();
  const customCategoriesLens = getSubLens(gameLens, "customEntries");

  if (category === "npc") {
    return <AllNpcs />;
  }

  if (category === "item") {
    return <AllItems />;
  }

  const customCategory = gameLens.state.customEntries.find(
    (c) => c.id === category
  );
  if (customCategory !== undefined) {
    const idx = gameLens.state.customEntries.findIndex(
      (c) => c.id === category
    );
    const categoryLens = getSubArrayLens(customCategoriesLens, idx);
    const entriesLens = getSubLens(categoryLens, "entries");
    return (
      <AllEntriesForCategory
        category={customCategory.name}
        categoryLens={entriesLens}
        onDeleteCategory={() =>
          gameLens.setState((d) => {
            d.customEntries = d.customEntries.filter(
              (c) => c.id !== categoryLens.state.id
            );
          })
        }
      />
    );
  }

  return <CategoryList />;
}

function CategoryList() {
  const gameLens = useCurrentGame();
  const customCategoriesLens = getSubLens(gameLens, "customEntries");

  return (
    <div className="flex flex-col gap-2">
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
      <div className="flex flex-wrap gap-2">
        <Card className="max-w-xs w-full">
          <CardHeader>
            <TitleWithIcons name="NPCs">
              <ButtonLike variant="ghost" size="icon-sm">
                <CategoryLink name="npc" />
              </ButtonLike>
            </TitleWithIcons>
          </CardHeader>
        </Card>
        <Card className="max-w-xs w-full">
          <CardHeader>
            <TitleWithIcons name="Items">
              <ButtonLike variant="ghost" size="icon-sm">
                <CategoryLink name="item" />
              </ButtonLike>
            </TitleWithIcons>
          </CardHeader>
        </Card>
        {customCategoriesLens.state.map((category, idx) => {
          const categoryLens = getSubArrayLens(customCategoriesLens, idx);
          const categoryName = categoryLens.state.name;
          return (
            <Card className="max-w-xs w-full">
              <CardHeader>
                <TitleWithIcons name={categoryName}>
                  <ButtonLike variant="ghost" size="icon-sm">
                    <CategoryLink name={category.id} />
                  </ButtonLike>
                  <DeleteAlert
                    icon={
                      <ButtonLike variant="ghost" size="icon-sm">
                        <Trash2Icon />
                      </ButtonLike>
                    }
                    onConfirm={() =>
                      gameLens.setState((d) => {
                        d.customEntries = d.customEntries.filter(
                          (c) => c.id !== categoryLens.state.id
                        );
                      })
                    }
                  >
                    This will permanently delete this category and all its items
                  </DeleteAlert>
                </TitleWithIcons>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
