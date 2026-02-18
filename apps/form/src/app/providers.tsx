"use client";

import { ConvexProviderWithURL } from "@repo/convex/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const url =
    process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud";
  return <ConvexProviderWithURL url={url}>{children}</ConvexProviderWithURL>;
}
