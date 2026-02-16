import {
  ConvexProvider as BaseConvexProvider,
  ConvexReactClient,
  useMutation,
  useQuery,
} from "convex/react";
import { type ReactNode } from "react";

export {
  BaseConvexProvider as ConvexProvider,
  ConvexReactClient,
  useMutation,
  useQuery,
};

interface ConvexProviderWithURLProps {
  url: string;
  children: ReactNode;
}

/**
 * Convex provider that takes the deployment URL. Use in app entry:
 * <ConvexProviderWithURL url={import.meta.env.VITE_CONVEX_URL}>
 *   {children}
 * </ConvexProviderWithURL>
 */
export function ConvexProviderWithURL({
  url,
  children,
}: ConvexProviderWithURLProps) {
  const client = new ConvexReactClient(url);
  return <BaseConvexProvider client={client}>{children}</BaseConvexProvider>;
}
