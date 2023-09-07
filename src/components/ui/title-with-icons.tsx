import { Children } from "./types";
import { CardTitle } from "./card";

interface Props extends Children {
  name: string;
}

export function TitleWithIcons({ name, children }: Props) {
  return (
    <div className="flex justify-between items-center w-full">
      <CardTitle>{name}</CardTitle>
      <div className="flex">{children}</div>
    </div>
  );
}
