import { cn } from "@/lib/utils";
import { Children, ClassName } from "./types";
import { VariantProps, cva } from "class-variance-authority";

export function Emph({ children, className }: Children & ClassName) {
  return <span className={cn(className, "italic")}>{children}</span>;
}

export function StrongEmph({ children, className }: Children & ClassName) {
  return <span className={cn(className, "font-bold")}>{children}</span>;
}

export function WeakEmph({ children, className }: Children & ClassName) {
  return <span className={cn(className, "text-sm text-muted-foreground")}>{children}</span>;
}

const titleVariants = cva("text-center text-2xl font-bold", {
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
