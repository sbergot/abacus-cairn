import { useGameContext, useCurrentGame } from "@/app/cairn-context";
import { Button } from "@/components/ui/button";
import { FileImport } from "@/components/ui/file-import";
import { itemsByCategory } from "@/lib/game/cairn/items-data";
import { Gear } from "@/lib/game/cairn/types";
import { downloadJson } from "@/lib/utils";
import { UploadIcon } from "lucide-react";

export function ManageCustomItems() {
  const { gameName } = useGameContext();
  const lens = useCurrentGame();
  return (
    <>
      <FileImport
        variant="secondary"
        label="import shop items"
        onUpLoad={(body) => {
          lens.setState((d) => {
            const newData = JSON.parse(body) as Record<string, Gear[]>;
            d.customData.customItemsByCategory = newData;
          });
        }}
      />
      <Button
        variant="secondary"
        onClick={() =>
          downloadJson(
            `${gameName}-custom-items`,
            lens.state.customData.customItemsByCategory ?? itemsByCategory
          )
        }
      >
        <UploadIcon className="mr-2" />
        export shop items
      </Button>
    </>
  );
}
