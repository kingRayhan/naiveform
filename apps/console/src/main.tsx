import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProviderWithURL } from "@repo/convex/react";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}
if (!CONVEX_URL) {
  throw new Error("Add VITE_CONVEX_URL to the .env file");
}

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProviderWithURL url={CONVEX_URL}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <RouterProvider router={router} />
      </ClerkProvider>
    </ConvexProviderWithURL>
  </StrictMode>
);
