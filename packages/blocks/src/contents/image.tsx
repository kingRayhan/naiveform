import type { ImageBlock } from "@repo/types";
import { cva } from "class-variance-authority";

export interface ImageBlockProps {
  block: ImageBlock;
}

const imageVariants = cva("", {
  variants: {
    state: {
      placeholder: "text-muted-foreground text-sm",
      loaded: "max-w-full h-auto rounded-md",
    },
  },
  defaultVariants: {
    state: "placeholder",
  },
});

export function ImageBlockContent({ block }: ImageBlockProps) {
  const url = block.imageUrl ?? "";
  const alt = block.settings?.alt ?? "";

  if (!url) {
    return <div className={imageVariants({ state: "placeholder" })}>Image</div>;
  }
  return (
    <img
      src={url}
      alt={alt}
      className={imageVariants({ state: "loaded" })}
    />
  );
}
