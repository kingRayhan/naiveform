import { ConvexHttpClient } from "convex/browser";

let _client: ConvexHttpClient | null = null;

function getClient(): ConvexHttpClient {
  if (!_client) {
    const url = process.env.CONVEX_URL;
    if (!url) {
      throw new Error(
        "CONVEX_URL environment variable is not set. Set it in Vercel project settings or in .env locally."
      );
    }
    _client = new ConvexHttpClient(url);
  }
  return _client;
}

export const convexClient = {
  query: (fn: Parameters<ConvexHttpClient["query"]>[0], args: Parameters<ConvexHttpClient["query"]>[1]) =>
    getClient().query(fn, args),
  mutation: (fn: Parameters<ConvexHttpClient["mutation"]>[0], args: Parameters<ConvexHttpClient["mutation"]>[1]) =>
    getClient().mutation(fn, args),
};
