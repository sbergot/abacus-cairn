import { Button, ButtonProps } from "./button";
import { Children } from "./types";

interface Props extends ButtonProps, Children {}

export function ButtonLike({ children, ...props }: Props) {
  return (
    <Button {...props} asChild>
      <span className="flex items-center">{children}</span>
    </Button>
  );
}
