import type { HeadingBlock } from "@repo/types";
import { cva, type VariantProps } from "class-variance-authority";

export interface HeadingBlockProps {
  block: HeadingBlock;
}

const headingVariants = cva("font-semibold", {
  variants: {
    level: {
      1: "text-2xl",
      2: "text-xl",
      3: "text-lg",
      4: "text-base",
      5: "text-sm",
      6: "text-xs",
    },
    hasText: {
      true: "text-foreground",
      false: "text-muted-foreground",
    },
  },
  defaultVariants: {
    level: 2,
    hasText: false,
  },
});

type HeadingVariants = VariantProps<typeof headingVariants>;

export function HeadingBlockContent({ block }: HeadingBlockProps) {
  const level = (block.settings?.level ?? 2) as HeadingVariants["level"];
  const text = block.text ?? "";
  const hasText = text.length > 0;
  const content = text || "Heading text";
  const className = headingVariants({ level, hasText });

  switch (level) {
    case 1:
      return <h1 className={className}>{content}</h1>;
    case 2:
      return <h2 className={className}>{content}</h2>;
    case 3:
      return <h3 className={className}>{content}</h3>;
    case 4:
      return <h4 className={className}>{content}</h4>;
    case 5:
      return <h5 className={className}>{content}</h5>;
    case 6:
      return <h6 className={className}>{content}</h6>;
    default:
      return <h2 className={className}>{content}</h2>;
  }
}
