import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQuery, useMutation } from "@repo/convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { getErrorMessage } from "@repo/convex/error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/design-system/button";
import { FormCheckbox } from "@repo/design-system/form/form-checkbox";
import { FormFieldGroup } from "@repo/design-system/form/form-field-group";
import { FormInput } from "@repo/design-system/form/form-input";
import { FormTextarea } from "@repo/design-system/form/form-textarea";

const settingsSchema = z.object({
  title: z.string().min(1, "Form name is required"),
  description: z.string().optional(),
  slug: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v),
      "Use lowercase letters, numbers and hyphens only"
    ),
  limitOneResponsePerPerson: z.boolean(),
  confirmationMessage: z.string().optional(),
  redirectUrl: z
    .string()
    .optional()
    .refine(
      (v) => v === undefined || v === "" || /^https?:\/\/.+/.test(v),
      "Enter a valid URL or leave empty"
    ),
  closeAtDate: z.string().optional(), // YYYY-MM-DD or empty
  isClosed: z.boolean(),
  archived: z.boolean(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export const Route = createFileRoute("/forms/$formId/settings")({
  component: FormSettingsPage,
});

function FormSettingsPage() {
  const { formId } = useParams({ from: "/forms/$formId/settings" });
  const formIdTyped = formId as Id<"forms">;
  const form = useQuery(api.forms.get, { formId: formIdTyped });
  const updateForm = useMutation(api.forms.update);

  const formRHF = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      limitOneResponsePerPerson: false,
      confirmationMessage: "",
      redirectUrl: "",
      closeAtDate: "",
      isClosed: false,
      archived: false,
    },
  });

  const hasSyncedRef = useRef(false);
  const prevFormIdRef = useRef(formId);
  useEffect(() => {
    if (!form) return;
    if (prevFormIdRef.current !== formId) {
      prevFormIdRef.current = formId;
      hasSyncedRef.current = false;
    }
    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;
    const s = form.settings;
    const closeAt = s?.closeAt;
    const closeAtDate =
      closeAt != null ? new Date(closeAt).toISOString().slice(0, 10) : "";
    formRHF.reset({
      title: form.title ?? "",
      description: form.description ?? "",
      slug: form.slug ?? "",
      limitOneResponsePerPerson: s?.limitOneResponsePerPerson ?? false,
      confirmationMessage: s?.confirmationMessage ?? "",
      redirectUrl: s?.redirectUrl ?? "",
      closeAtDate,
      isClosed: form.isClosed ?? false,
      archived: form.archived ?? false,
    });
  }, [form, formId, formRHF]);

  const onSubmit = async (data: SettingsValues) => {
    const closeAt =
      data.closeAtDate && data.closeAtDate.trim()
        ? new Date(data.closeAtDate + "T23:59:59.999Z").getTime()
        : undefined;
    const redirectUrl =
      typeof data.redirectUrl === "string" ? data.redirectUrl.trim() : "";
    try {
      await updateForm({
        formId: formIdTyped,
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        slug: data.slug?.trim() || undefined,
        isClosed: data.isClosed,
        archived: data.archived,
        settings: {
          limitOneResponsePerPerson: data.limitOneResponsePerPerson,
          confirmationMessage: data.confirmationMessage?.trim() || undefined,
          redirectUrl: redirectUrl || undefined,
          closeAt,
        },
      });
      formRHF.reset(data);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to save settings");
      const isSlugError = message.toLowerCase().includes("slug");
      if (isSlugError) {
        formRHF.setError("slug", { message });
      } else {
        formRHF.setError("root", { message });
      }
    }
  };

  if (form === undefined) {
    return <div className="text-muted-foreground">Loading…</div>;
  }
  if (form === null) {
    return <div className="text-destructive">Form not found.</div>;
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold text-foreground mb-1">
        Form settings
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Configure how your form collects responses and when it closes.
      </p>

      <form onSubmit={formRHF.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          name="title"
          control={formRHF.control}
          label="Form name"
          placeholder="Untitled form"
          required
        />
        <FormTextarea
          name="description"
          control={formRHF.control}
          label="Form description"
          description="Optional short description shown to respondents."
          placeholder="Add a short description"
          rows={2}
        />
        <FormInput
          name="slug"
          control={formRHF.control}
          label="Public URL slug"
          description="Used in the shareable form URL (e.g. event-form-abc12). Letters, numbers and hyphens only."
          placeholder="my-form"
        />

        <FormFieldGroup title="Response options">
          <FormCheckbox
            name="limitOneResponsePerPerson"
            control={formRHF.control}
            label="Limit to one response per person"
          />
        </FormFieldGroup>

        <FormTextarea
          name="confirmationMessage"
          control={formRHF.control}
          label="Confirmation message"
          description="Shown after someone submits the form (optional)."
          placeholder="Thanks for your response!"
          rows={2}
        />

        <FormInput
          name="redirectUrl"
          control={formRHF.control}
          label="Redirect URL after submit"
          type="url"
          placeholder="https://..."
          description="Leave empty to show the confirmation message on the same page."
        />

        <FormInput
          name="closeAtDate"
          control={formRHF.control}
          label="Close form on date"
          type="date"
          description="Form will stop accepting responses after this date (optional)."
        />

        <FormFieldGroup title="Status">
          <FormCheckbox
            name="isClosed"
            control={formRHF.control}
            label="Form is closed (stop accepting responses)"
          />
          <div className="bg-destructive/30 py-2 px-1">
            <FormCheckbox
              name="archived"
              control={formRHF.control}
              label="Archive form (hide from dashboard, keep data)"
            />
          </div>
        </FormFieldGroup>

        {formRHF.formState.errors.root && (
          <p className="text-sm text-destructive" role="alert">
            {formRHF.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={formRHF.formState.isSubmitting}>
          {formRHF.formState.isSubmitting ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
