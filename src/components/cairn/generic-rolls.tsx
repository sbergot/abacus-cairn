import { useLoggerContext } from "@/app/cairn/cairn-context";
import { Dice2Icon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { roll } from "@/lib/random";

export function GenericRolls() {
  const { log } = useLoggerContext();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon-sm">
          <Dice2Icon size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a roll</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <div className="w-40">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="dice" />
              </SelectTrigger>
              <SelectContent>
                {[4, 6, 8, 10, 12].map((d) => (
                  <SelectItem value={d.toString()}>d{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            Attack <Checkbox />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={() => {
            log({
              kind: "chat-custom",
              type: "AttackRoll",
              title: "Generic roll",
              props: { dice: 4, result: roll(1, 4) }
            })
            setOpen(false);}} className="w-full">
            Roll
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
