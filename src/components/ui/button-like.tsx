import { Button, ButtonProps } from "./button";
import { Children } from "./types";

interface Props extends ButtonProps, Children {}

export function ButtonLike({ children, ...props }: Props) {
  return (
    <Button variant={props.variant} size={props.size}>
      <span className="flex items-center">{children}</span>
    </Button>
  );
}
