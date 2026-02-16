import { ConvexError } from "convex/values";

/**
 * Returns a user-friendly error message from a caught Convex mutation/query error.
 * Uses ConvexError.data when available, otherwise Error.message, or a default.
 */
export function getErrorMessage(
  err: unknown,
  defaultMessage = "Something went wrong"
): string {
  if (err instanceof ConvexError) {
    const data = err.data;
    return typeof data === "string"
      ? data
      : (data as { message?: string })?.message ?? defaultMessage;
  }
  if (err instanceof Error) return err.message;
  return defaultMessage;
}
