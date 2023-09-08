import { Button } from "@/components/ui/button";
import { ButtonLike } from "@/components/ui/button-like";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/lib/game/types";
import { FolderPlusIcon } from "lucide-react";
import { useState } from "react";

interface NewCategoryDialogProps {
  onCreate(name: string, type: CategoryType): void;
}

export function NewCategoryDialog({ onCreate }: NewCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("misc");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonLike>
          <FolderPlusIcon className="mr-2" /> New category
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <div className="flex gap-2">
        <div className="flex-grow">
          <div>Name</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <div>Type</div>
          <Select
            value={type}
            onValueChange={(v) => setType(v as CategoryType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="misc">misc</SelectItem>
              <SelectItem value="character">character</SelectItem>
              <SelectItem value="item">item</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>
        <Button
          onClick={() => {
            onCreate(name, type);
            setOpen(false);
          }}
        >
          create
        </Button>
      </DialogContent>
    </Dialog>
  );
}
