import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  throw new Error(
    "CONVEX_URL environment variable is not set.\n" +
      "Create a .env file in apps/api/ with:\n" +
      "CONVEX_URL=https://your-deployment.convex.cloud\n" +
      "\n" +
      "Or set it in your deployment environment (e.g. Vercel project settings)."
  );
}

export const convexClient = new ConvexHttpClient(CONVEX_URL);
