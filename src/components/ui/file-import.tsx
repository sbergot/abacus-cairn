import { uuidv4 } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import { DownloadIcon } from "lucide-react";

interface FileImportProps extends ButtonProps {
  onUpLoad(body: string): void;
  label: string;
}

export function FileImport({
  onUpLoad,
  label,
  ...buttonProps
}: FileImportProps) {
  const fileInputKey = uuidv4();

  return (
    <>
      <Button asChild {...buttonProps}>
        <label htmlFor={fileInputKey} className="cursor-pointer">
          <DownloadIcon className="mr-2" />
          {label}
        </label>
      </Button>
      <input
        type="file"
        className="opacity-0 absolute -z-10"
        id={fileInputKey}
        key={fileInputKey}
        onChange={(event) => {
          var file = event.target.files![0];
          var reader = new FileReader();
          reader.onload = function (readerevent) {
            const fileContent: string = readerevent.target!.result as string;
            onUpLoad(fileContent);
          };

          reader.readAsText(file);
        }}
      />
    </>
  );
}
