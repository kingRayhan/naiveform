import type { ZodError } from "zod";

/**
 * POST /f/:formId – success response (200)
 */
export type SubmitFormSuccess = {
  message: string;
  responseId: string;
};

/**
 * POST /f/:formId – error response (4xx, 5xx)
 */
export type SubmitFormError = {
  error: string;
};

/**
 * POST /f/:formId – validation error response (400)
 */
export type SubmitFormValidationError = {
  errors: ZodError["issues"];
};
