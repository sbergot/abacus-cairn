import { Children } from "../ui/types";
import { CardTitle } from "../ui/card";

interface Props extends Children {
  name: string;
}

export function TitleWithIcons({ name, children }: Props) {
  return (
    <div className="flex justify-between items-start w-full">
      <CardTitle>{name}</CardTitle>
      <div className="flex">{children}</div>
    </div>
  );
}
