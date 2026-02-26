import { render } from "@react-email/render";
import { WelcomeNewUser } from "@repo/email";
import nodemailer from "nodemailer";

const hasSmtpAuth = process.env.SMTP_USER && process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.forwardemail.net",
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE !== "false",
  auth: hasSmtpAuth
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

const FROM_EMAIL = process.env.EMAIL_FROM ?? "you@example.com";

export async function sendWelcomeEmail({
  to,
  userName,
}: {
  to: string;
  userName: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!hasSmtpAuth) {
    console.warn("SMTP_USER/SMTP_PASS not set; skipping welcome email");
    return { success: false, error: "SMTP not configured" };
  }

  try {
    const emailHtml = await render(<WelcomeNewUser userName={userName} />);

    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to Naiveform, ${userName}!`,
      html: emailHtml,
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Failed to send welcome email:", message);
    return { success: false, error: message };
  }
}
