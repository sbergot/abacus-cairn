import { CardHeader } from "./card";
import { CardMenu } from "./card-menu";
import { TitleWithIcons } from "./title-with-icons";
import { Children } from "./types";

interface Props extends Children {
    title: string;
}

export function CardHeaderWithMenu({ title, children }: Props) {
    return <CardHeader className="flex justify-between flex-row items-center w-full">
    <TitleWithIcons name={title}>
      <CardMenu>
        {children}
      </CardMenu>
    </TitleWithIcons>
  </CardHeader>
}