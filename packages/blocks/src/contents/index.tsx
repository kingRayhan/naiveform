import type { ContentBlock } from "@repo/types";
import { DividerBlockContent } from "./divider";
import { HeadingBlockContent } from "./heading";
import { ImageBlockContent } from "./image";
import { ParagraphBlockContent } from "./paragraph";
import { YoutubeEmbedBlockContent } from "./youtube-embed";

export { DividerBlockContent } from "./divider";
export type { DividerBlockProps } from "./divider";
export { HeadingBlockContent } from "./heading";
export type { HeadingBlockProps } from "./heading";
export { ImageBlockContent } from "./image";
export type { ImageBlockProps } from "./image";
export { ParagraphBlockContent } from "./paragraph";
export type { ParagraphBlockProps } from "./paragraph";
export { YoutubeEmbedBlockContent } from "./youtube-embed";
export type { YoutubeEmbedBlockProps } from "./youtube-embed";

export function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return <HeadingBlockContent block={block} />;
    case "paragraph":
      return <ParagraphBlockContent block={block} />;
    case "image":
      return <ImageBlockContent block={block} />;
    case "youtube_embed":
      return <YoutubeEmbedBlockContent block={block} />;
    case "divider":
      return <DividerBlockContent block={block} />;
    default:
      return null;
  }
}
