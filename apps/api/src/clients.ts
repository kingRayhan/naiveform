import { ConvexHttpClient } from "convex/browser";

let _client: ConvexHttpClient | null = null;

export function getClient(): ConvexHttpClient {
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
