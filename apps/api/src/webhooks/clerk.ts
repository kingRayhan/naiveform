import { verifyWebhook } from "@clerk/backend/webhooks";
import type { Context } from "hono";
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

    if (event.type === "user.created") {
      const user = event.data;
      const primaryEmailId = user.primary_email_address_id;
      const emailRecord = user.email_addresses?.find(
        (e) => e.id === primaryEmailId
      );
      const email = emailRecord?.email_address;

      const userName =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.username ||
        email?.split("@")[0] ||
        "there";

      if (email) {
        await sendWelcomeEmail({ to: email, userName });
      }
    }

    return c.json({ received: true }, 200);
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return c.json({ error: "Webhook verification failed" }, 400);
  }
}
