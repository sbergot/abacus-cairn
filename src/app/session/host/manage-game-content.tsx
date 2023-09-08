import { useCurrentGame } from "@/app/cairn-context";
import { Button } from "@/components/ui/button";
import { FileImport } from "@/components/ui/file-import";
import { CairnCharacter, Gear } from "@/lib/game/cairn/types";
import { AnyCategory } from "@/lib/game/types";
import { clone, downloadJson } from "@/lib/utils";
import { UploadIcon } from "lucide-react";

export function ManageGameContent() {
  const lens = useCurrentGame();
  return (
    <>
      <FileImport
        variant="secondary"
        label="import game content"
        onUpLoad={(body) => {
          lens.setState((d) => {
            const newData = JSON.parse(body) as AnyCategory<
              CairnCharacter,
              Gear
            >[];
            d.content = [...d.content, ...newData.map(clone)];
          });
        }}
      />
      <Button
        variant="secondary"
        onClick={() =>
          downloadJson(`${lens.state.name}-game-content`, lens.state.content)
        }
      >
        <UploadIcon className="mr-2" />
        export game content
      </Button>
    </>
  );
}
