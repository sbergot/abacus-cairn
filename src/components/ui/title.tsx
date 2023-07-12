import { Children, ClassName } from "./types";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const titleVariants = cva("text-center text-xl mb-2", {
  variants: {
    variant: {
      primary: "text-secondary-foreground",
      secondary: "text-primary-foreground",
    },
  },
  defaultVariants: { variant: "primary" }
});

interface TitleProps
  extends Children,
    ClassName,
    VariantProps<typeof titleVariants> {}

export function Title({ children, variant, className }: TitleProps) {
  return (
    <div className={cn(titleVariants({ variant, className }))}>{children}</div>
  );
}
