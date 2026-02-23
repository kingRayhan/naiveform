import type { ParagraphBlock } from "@repo/types";
import { cva, type VariantProps } from "class-variance-authority";

export interface ParagraphBlockProps {
  block: ParagraphBlock;
}

const paragraphVariants = cva("whitespace-pre-wrap", {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    fontSize: {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    },
    hasContent: {
      true: "text-foreground",
      false: "text-muted-foreground",
    },
  },
  defaultVariants: {
    align: "left",
    fontSize: "medium",
    hasContent: false,
  },
});

type ParagraphVariants = VariantProps<typeof paragraphVariants>;

export function ParagraphBlockContent({ block }: ParagraphBlockProps) {
  const align = (block.settings?.align ?? "left") as ParagraphVariants["align"];
  const fontSize = (block.settings?.fontSize ??
    "medium") as ParagraphVariants["fontSize"];
  const content = block.content ?? "";
  const hasContent = content.length > 0;

  return (
    <p className={paragraphVariants({ align, fontSize, hasContent })}>
      {content || "Paragraph content"}
    </p>
  );
}
