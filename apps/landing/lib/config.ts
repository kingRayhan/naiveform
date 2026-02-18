const base = process.env.NEXT_PUBLIC_CONSOLE_APP_URL ?? "http://localhost:5173";

export const CONSOLE_APP_URL = base.replace(/\/$/, "");
export const CONSOLE_APP_NEW_FORM_URL = `${CONSOLE_APP_URL}/forms/new`;
export const CONSOLE_APP_SIGN_IN_URL = CONSOLE_APP_URL;
