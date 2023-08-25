import { Title } from "../ui/typography";
import { Children } from "../ui/types";

interface Props extends Children {
  name: string;
}

export function TitleWithIcons({ name, children }: Props) {
  return (
    <div className="flex justify-between items-start">
      <Title>{name}</Title>
      <div className="flex">{children}</div>
    </div>
  );
}
