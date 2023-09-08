import { useCurrentGame } from "@/app/cairn-context";
import {
  getSubArrayLensById,
  getSubLens,
  uuidv4,
} from "@/lib/utils";
import { ManageCustomItems } from "./manage-custom-items";
import { AllItems } from "./game-items";
import { AllNpcs } from "./game-npcs";
import { AllEntriesForCategory } from "./game-custom-categories";
import { NewCategoryDialog } from "./new-category-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TitleWithIcons } from "@/components/ui/title-with-icons";
import { FolderOpenIcon, Trash2Icon } from "lucide-react";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { ButtonLike } from "@/components/ui/button-like";
import { useRelativeLinker, useUrlParams } from "@/lib/hooks";
import Link from "next/link";
import { StrongEmph, WeakEmph } from "@/components/ui/typography";
import { CairnCharacter, Gear } from "@/lib/game/cairn/types";
import { BaseCategory } from "@/lib/game/types";
import { ILens } from "@/lib/types";
import { ManageGameContent } from "./manage-game-content";

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
      return (
        <AllItems
          itemCategoryLens={categoryLens as ILens<BaseCategory<"item", Gear>>}
        />
      );
    }

    if (categoryLens.state.type === "misc") {
      return (
        <AllEntriesForCategory
          categoryLens={categoryLens as ILens<BaseCategory<"misc", {}>>}
        />
      );
    }

    throw new Error("unknown category type");
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
          onCreate={(name, type) =>
            gameLens.setState((d) => {
              d.content.push({
                id: uuidv4(),
                type,
                name,
                description: "",
                entries: [],
              });
            })
          }
        />
        <ManageCustomItems />
        <ManageGameContent />
      </div>
      <div className="flex flex-wrap gap-2">
        {customCategoriesLens.state.map((category) => {
          const categoryLens = getSubArrayLensById(customCategoriesLens, category.id);
          const categoryName = categoryLens.state.name;
          return (
            <Card key={category.id} className="max-w-xs w-full">
              <CardHeader className="pb-0">
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
              <CardContent>
                <WeakEmph>{category.type}</WeakEmph>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
