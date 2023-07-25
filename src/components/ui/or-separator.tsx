import { Separator } from "./separator";

export function OrSeparator() {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-grow">
        <Separator />
      </div>
      <div>Or</div>
      <div className="flex-grow">
        <Separator />
      </div>
    </div>
  );
}