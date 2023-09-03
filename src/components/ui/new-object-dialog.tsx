import { ILens } from "@/lib/types";
import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { useLens } from "@/lib/hooks";

interface Props<T> {
  trigger: ReactNode;
  title?: string;
  initialValue: T;
  validate(o: T): boolean;
  onCreate(o: T): void;
  children(lens: ILens<T>): ReactNode;
}

export function NewObjectDialog<T>({
  trigger,
  title,
  initialValue,
  validate,
  onCreate,
  children,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const lens = useLens<T>(initialValue);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {children(lens)}
        <Button
          onClick={() => {
            setOpen(false);
            const result = lens.state;
            lens.setState(d => ({...initialValue}))
            onCreate(result);
          }}
          disabled={!validate(lens.state)}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
