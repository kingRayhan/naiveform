"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexProviderWithURL } from "@repo/convex/react";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const url =
    process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud";
  return (
    <QueryClientProvider client={queryClient}>
      <ConvexProviderWithURL url={url}>{children}</ConvexProviderWithURL>
    </QueryClientProvider>
  );
}
