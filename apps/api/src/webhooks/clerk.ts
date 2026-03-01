import { verifyWebhook } from "@clerk/backend/webhooks";
import type { Context } from "hono";
import { api } from "@repo/convex";
import { getClient } from "../clients";
import { sendWelcomeEmail } from "../services/sendWelcomeEmail";

const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

export async function handleClerkWebhook(c: Context): Promise<Response> {
  if (!signingSecret) {
    console.error("CLERK_WEBHOOK_SIGNING_SECRET is not set");
    return c.json({ error: "Webhook not configured" }, 500);
  }

  try {
    const event = await verifyWebhook(c.req.raw, {
      signingSecret,
    });

    const isUserEvent =
      event.type === "user.created" || event.type === "user.updated";
    if (isUserEvent) {
      const convex = getClient();
      const user = event.data;
      const str = (s: string | null | undefined) => (s == null ? undefined : s);
      await convex.mutation(api.users.upsertFromClerk, {
        payload: {
          id: user.id,
          first_name: str(user.first_name),
          last_name: str(user.last_name),
          username: str(user.username),
          image_url: str(user.image_url),
          created_at: user.created_at ?? undefined,
          updated_at: user.updated_at ?? undefined,
          email_addresses: user.email_addresses?.map(
            (e: { id: string; email_address: string }) => ({
              id: e.id,
              email_address: e.email_address,
            })
          ),
          primary_email_address_id: str(user.primary_email_address_id),
        },
      });
    }

    if (event.type === "user.created") {
      await sendWelcomeEmail({
        to: event.data.email_addresses[0].email_address,
        userName:
          `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`.trim(),
      });
    }

    return c.json({ received: true }, 200);
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return c.json({ error: "Webhook verification failed" }, 400);
  }
}
