import { useState } from "react";
import { Button } from "@repo/design-system/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system/dialog";
import {
  CONTENT_BLOCK_TYPES,
  INPUT_BLOCK_TYPES,
  type ContentBlock,
  type InputBlock,
} from "@/lib/form-builder-types";
import { cn } from "@repo/design-system/utils";

export interface AddBlockDialogProps {
  onAddContent: (type: ContentBlock["type"]) => void;
  onAddInput: (type: InputBlock["type"]) => void;
}

const contentIcons: Record<ContentBlock["type"], string> = {
  heading: "H",
  paragraph: "P",
  image: "🖼",
  youtube_embed: "▶",
  divider: "—",
};

export function AddBlockDialog({ onAddContent, onAddInput }: AddBlockDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="border-dashed"
        >
          + Add block
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg" showCloseButton>
        <DialogTitle className="sr-only">Add block</DialogTitle>
        <div className="space-y-5 pt-1">
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Content
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CONTENT_BLOCK_TYPES.map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onAddContent(type);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-card p-4 text-center",
                    "hover:bg-muted/50 hover:border-muted-foreground/30 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  )}
                >
                  <span className="text-2xl font-bold text-muted-foreground leading-none">
                    {contentIcons[type]}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Inputs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto">
              {INPUT_BLOCK_TYPES.map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onAddInput(type);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border border-border bg-card py-3 px-3 text-center min-h-[72px]",
                    "hover:bg-muted/50 hover:border-muted-foreground/30 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  )}
                >
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
