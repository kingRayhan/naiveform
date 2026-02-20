import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

/**
 * HTTP router. Headless form submission (POST /f/:formIdOrSlug) lives in the Hono API app (apps/api).
 */
const http = httpRouter();

http.route({
  path: "/",
  method: "GET",
  handler: httpAction(async () => {
    return new Response("OK", { status: 200 });
  }),
});

export default http;
