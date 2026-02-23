import type { YouTubeEmbedBlock } from "@repo/types";
import { cva } from "class-variance-authority";

export interface YoutubeEmbedBlockProps {
  block: YouTubeEmbedBlock;
}

const youtubeEmbedVariants = cva("", {
  variants: {
    state: {
      placeholder: "text-muted-foreground text-sm",
      loaded: "aspect-video rounded-md overflow-hidden bg-muted",
    },
  },
  defaultVariants: {
    state: "placeholder",
  },
});

export function YoutubeEmbedBlockContent({ block }: YoutubeEmbedBlockProps) {
  const vid = block.youtubeVideoId ?? "";

  if (!vid) {
    return (
      <div className={youtubeEmbedVariants({ state: "placeholder" })}>
        YouTube video
      </div>
    );
  }
  return (
    <div className={youtubeEmbedVariants({ state: "loaded" })}>
      <iframe
        title="YouTube"
        src={`https://www.youtube.com/embed/${vid}`}
        className="w-full h-full"
        allowFullScreen
      />
    </div>
  );
}
