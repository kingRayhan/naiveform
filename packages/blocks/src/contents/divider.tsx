import type { DividerBlock } from "@repo/types";
import { cva, type VariantProps } from "class-variance-authority";

export interface DividerBlockProps {
  block: DividerBlock;
}

const dividerVariants = cva("border", {
  variants: {
    color: {
      light: "border-border",
      dark: "border-foreground/20",
    },
    thickness: {
      thin: "",
      medium: "border-2",
      thick: "border-4",
    },
  },
  defaultVariants: {
    color: "light",
    thickness: "thin",
  },
});

type DividerVariants = VariantProps<typeof dividerVariants>;

export function DividerBlockContent({ block }: DividerBlockProps) {
  const color = (block.settings?.color ?? "light") as DividerVariants["color"];
  const thickness = (block.settings?.thickness ?? "thin") as DividerVariants["thickness"];

  return <hr className={dividerVariants({ color, thickness })} />;
}
