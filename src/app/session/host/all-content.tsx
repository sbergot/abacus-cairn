import { useCurrentGame } from "@/app/cairn-context";
import {
  getSubArrayLens,
  getSubArrayLensById,
  getSubLens,
  uuidv4,
} from "@/lib/utils";
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
import { StrongEmph } from "@/components/ui/typography";
import { CairnCharacter, Gear } from "@/lib/game/cairn/types";
import { BaseCategory } from "@/lib/game/types";
import { ILens } from "@/lib/types";

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
  const customCategoriesLens = getSubLens(gameLens, "content");

  if (category !== undefined) {
    const categoryLens = getSubArrayLensById(customCategoriesLens, category);
    const entriesLens = getSubLens(categoryLens, "entries");

    if (categoryLens.state.type === "character") {
      return (
        <AllNpcs
          charCategoryLens={
            categoryLens as ILens<BaseCategory<"character", CairnCharacter>>
          }
        />
      );
    }

    if (categoryLens.state.type === "item") {
      <AllItems
        itemCategoryLens={categoryLens as ILens<BaseCategory<"item", Gear>>}
      />;
    }

    return (
      <AllEntriesForCategory
        category={categoryLens.state.name}
        categoryLens={entriesLens}
      />
    );
  }

  return <CategoryList />;
}

function CategoryList() {
  const gameLens = useCurrentGame();
  const customCategoriesLens = getSubLens(gameLens, "content");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <NewCategoryDialog
          onCreate={(name) =>
            gameLens.setState((d) => {
              d.content.push({
                id: uuidv4(),
                type: "misc",
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
            <Card key={category.id} className="max-w-xs w-full">
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
                        d.content = d.content.filter(
                          (c) => c.id !== categoryLens.state.id
                        );
                      })
                    }
                  >
                    This will permanently delete the{" "}
                    <StrongEmph>{category.name}</StrongEmph> category and{" "}
                    <StrongEmph>all its items</StrongEmph>
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
