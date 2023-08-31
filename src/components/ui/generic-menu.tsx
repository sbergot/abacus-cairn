import { WithId } from "@/lib/game/types";
import { download } from "@/lib/utils";
import { UserPlusIcon, UploadIcon } from "lucide-react";
import { Button } from "./button";
import { FileImport } from "./file-import";
import { Title } from "./typography";
import Link from "next/link";
import { useGenericGameContext } from "@/lib/gameContext";
import { ILens } from "@/lib/types";
import { Draft } from "immer";
import { ReactNode } from "react";

interface EntryProps<T> {
  name: string;
  id: string;
  deleteObj(): void;
}

interface Props<T> {
  title: string;
  lens: ILens<Record<string, T>>;
  Entry(props: EntryProps<T>): ReactNode;
  Create(): ReactNode
}

export function GenericMenu<T extends WithId & { name: string }>({
  title,
  lens,
  Entry,
  Create
}: Props<T>) {
  const { gameName } = useGenericGameContext();
  return (
    <div className="flex flex-col gap-2 max-w-lg w-full items-start">
      <Title>{title}s</Title>
      <div className="flex gap-2">
        <Create />
        <FileImport
          variant="secondary"
          label="import"
          onUpLoad={(body) => {
            lens.setState((d) => {
              const newData = JSON.parse(body) as Record<string, Draft<T>>;
              Object.values(newData).forEach((c) => (d[c.id] = c));
            });
          }}
        />
        <Button
          variant="secondary"
          onClick={() => download(`${gameName}-${title}s`)}
        >
          <UploadIcon className="mr-2" />
          export
        </Button>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {Object.values(lens.state).length === 0 && <div>No {title} found</div>}
        {Object.values(lens.state).map((c) => (
          <Entry
            key={c.id}
            name={c.name}
            id={c.id}
            deleteObj={() =>
              lens.setState((repo) => {
                delete repo[c.id];
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
