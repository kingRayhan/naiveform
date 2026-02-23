import type { InputBlock } from "@repo/types";
import { z } from "zod";

/** Build a Zod schema for form values from input blocks. */
export function buildFormSchema(inputBlocks: InputBlock[]) {
  const shape: Record<string, z.ZodType<string | string[]>> = {};

  for (const block of inputBlocks) {
    const required = block.settings?.required ?? false;
    const id = block.id;

    switch (block.type) {
      case "text": {
        const minLength = block.settings?.minLength;
        const maxLength = block.settings?.maxLength;
        let base = z.string();
        if (required) base = base.min(1, "This field is required");
        if (minLength != null)
          base = base.min(minLength, `At least ${minLength} characters`);
        if (maxLength != null)
          base = base.max(maxLength, `At most ${maxLength} characters`);
        shape[id] = base;
        break;
      }

      case "email": {
        const minLength = block.settings?.minLength;
        const maxLength = block.settings?.maxLength;
        let base = z
          .string()
          .refine(
            (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            "Please enter a valid email address"
          );
        if (required) base = base.min(1, "This field is required");
        if (minLength != null)
          base = base.min(minLength, `At least ${minLength} characters`);
        if (maxLength != null)
          base = base.max(maxLength, `At most ${maxLength} characters`);
        shape[id] = base;
        break;
      }

      case "phone": {
        let base = z.string();
        if (required) base = base.min(1, "This field is required");
        shape[id] = base;
        break;
      }

      case "url": {
        const minLength = block.settings?.minLength;
        const maxLength = block.settings?.maxLength;
        let base = z.string();
        if (required) base = base.min(1, "This field is required");
        if (minLength != null)
          base = base.min(minLength, `At least ${minLength} characters`);
        if (maxLength != null)
          base = base.max(maxLength, `At most ${maxLength} characters`);
        shape[id] = base;
        break;
      }

      case "long_text": {
        const minLength = block.settings?.minLength;
        const maxLength = block.settings?.maxLength;
        let base = z.string();
        if (required) base = base.min(1, "This field is required");
        if (minLength != null)
          base = base.min(minLength, `At least ${minLength} characters`);
        if (maxLength != null)
          base = base.max(maxLength, `At most ${maxLength} characters`);
        shape[id] = base;
        break;
      }

      case "radio":
        shape[id] = required
          ? z.string().min(1, "Select an option")
          : z.string();
        break;

      case "dropdown":
        shape[id] = required
          ? z.string().min(1, "Choose an option")
          : z.string();
        break;

      case "checkbox": {
        const minSelections = block.settings?.minSelections;
        const maxSelections = block.settings?.maxSelections;
        let base = z.array(z.string());
        if (required) base = base.min(1, "Select at least one");
        if (minSelections != null)
          base = base.min(
            minSelections,
            `Select at least ${minSelections} option(s)`
          );
        if (maxSelections != null)
          base = base.max(
            maxSelections,
            `Select at most ${maxSelections} option(s)`
          );
        shape[id] = base;
        break;
      }

      case "date":
      case "time":
      case "datetime":
        shape[id] = required
          ? z.string().min(1, "This field is required")
          : z.string();
        break;

      case "number": {
        const min = block.settings?.min;
        const max = block.settings?.max;
        let base = z.string();
        if (required) base = base.min(1, "This field is required");
        if (min != null)
          base = base.refine(
            (v) => v === "" || Number(v) >= min,
            `Minimum value is ${min}`
          );
        if (max != null)
          base = base.refine(
            (v) => v === "" || Number(v) <= max,
            `Maximum value is ${max}`
          );
        shape[id] = base;
        break;
      }

      case "star_rating": {
        const max = block.settings?.ratingMax ?? 5;
        const count = Math.min(10, Math.max(3, max));
        let base = z.string();
        if (required) base = base.min(1, "Please select a rating");
        base = base.refine(
          (v) =>
            v === "" ||
            (() => {
              const n = parseInt(v, 10);
              return !Number.isNaN(n) && n >= 1 && n <= count;
            })(),
          `Please select between 1 and ${count}`
        );
        shape[id] = base;
        break;
      }

      case "linear_scale":
        if ("settings" in block && block.settings) {
          const min = block.settings.min;
          const max = block.settings.max;
          const scaleRequired = block.settings.required ?? false;
          let base = z.string();
          if (scaleRequired)
            base = base.min(1, "This field is required");
          base = base.refine(
            (v) =>
              v === "" ||
              (() => {
                const n = Number(v);
                return !Number.isNaN(n) && n >= min && n <= max;
              })(),
            `Please select a value between ${min} and ${max}`
          );
          shape[id] = base;
        } else {
          shape[id] = z.string();
        }
        break;

      case "yes_no":
        shape[id] = required
          ? z.string().min(1, "This field is required")
          : z.string();
        break;

      default:
        shape[id] = z.string();
    }
  }

  return z.object(shape);
}

export type FormSchemaValues = z.infer<ReturnType<typeof buildFormSchema>>;
