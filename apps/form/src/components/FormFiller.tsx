"use client";

import { FormRenderer, type FormRendererValues } from "@repo/blocks";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import type { Doc } from "@repo/convex/dataModel";
import { useQuery } from "@repo/convex/react";
import { Button } from "@repo/design-system/button";
import type { SubmitFormSuccess } from "@repo/types";
import { getFormBlocks, isInputBlock } from "@repo/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { buildFormSchema } from "@/lib/formSchema";

interface FormFillerProps {
  formIdOrSlug: string;
}

/** Only mounts when form data exists so useForm gets correct defaultValues/schema (fixes prod RHF state). */
function FormFillerForm({
  form,
  setSubmitted,
  setSubmitError,
  submitMutation,
}: {
  form: Doc<"forms">;
  setSubmitted: (v: boolean) => void;
  setSubmitError: (v: string | null) => void;
  submitMutation: {
    mutateAsync: (vars: {
      payload: Record<string, string | string[]>;
      formId: string;
    }) => Promise<
      { redirect?: string; success?: SubmitFormSuccess } | undefined
    >;
    isPending: boolean;
  };
}) {
  const blocks = getFormBlocks(form);
  const inputBlocks = blocks.filter(isInputBlock);

  const defaultValues: FormRendererValues = {};
  for (const b of inputBlocks) {
    if (b.type === "checkbox") defaultValues[b.id] = [];
    else {
      const defaultValue =
        "settings" in b
          ? (b.settings as { defaultValue?: string })?.defaultValue
          : undefined;
      defaultValues[b.id] = defaultValue ?? "";
    }
  }

  const schema = useMemo(() => buildFormSchema(inputBlocks), [inputBlocks]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    clearErrors,
  } = useForm<FormRendererValues>({
    defaultValues,
    resolver: zodResolver(schema) as Resolver<FormRendererValues>,
    mode: "onChange",
  });

  const onSubmit = async (data: FormRendererValues) => {
    setSubmitError(null);
    try {
      const result = await submitMutation.mutateAsync({
        payload: data,
        formId: form._id as Id<"forms">,
      });
      setSubmitted(true);
      if (result && "redirect" in result && result.redirect) {
        window.location.assign(result.redirect);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred while submitting your response.";
      let humanized = message;
      if (message.toLowerCase().includes("closed")) {
        humanized = "This form is no longer accepting responses.";
      } else if (message.toLowerCase().includes("not found")) {
        humanized = "This form could not be found. It may have been deleted.";
      }
      setSubmitError(humanized);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl">
      {Object.keys(errors).length > 0 && (
        <div
          className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4"
          role="alert"
        >
          <p className="text-sm font-medium text-destructive">
            Please fix the errors below before submitting.
          </p>
        </div>
      )}

      <FormRenderer
        blocks={blocks}
        formTitle={form.title}
        formDescription={form.description ?? undefined}
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        watch={watch}
        clearErrors={clearErrors}
      />

      <div className="mt-6 pt-6">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || submitMutation.isPending}
        >
          {isSubmitting || submitMutation.isPending ? "Submitting…" : "Submit"}
        </Button>
      </div>
      <p className="mt-8 pt-4 text-center text-xs text-muted-foreground/60">
        Powered by{" "}
        <a
          href="https://naiveform.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-muted-foreground/80 transition-colors"
        >
          NaiveForm
        </a>
      </p>
    </form>
  );
}

export function FormFiller({ formIdOrSlug }: FormFillerProps) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isPastCloseTime, setIsPastCloseTime] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formBySlug = useQuery(api.forms.getBySlug, { slug: formIdOrSlug });
  const formById = useQuery(
    api.forms.get,
    formBySlug === null ? { formId: formIdOrSlug as Id<"forms"> } : "skip"
  );

  const form = formBySlug ?? (formBySlug === null ? formById : undefined);

  const submitMutation = useMutation({
    mutationFn: async ({
      payload,
      formId,
    }: {
      payload: Record<string, string | string[]>;
      formId: string;
    }) => {
      try {
        const res = await axios.post<SubmitFormSuccess>(
          `${process.env.NEXT_PUBLIC_FORM_API_URL}/f/${formId}`,
          { values: payload },
          {
            headers: { "Content-Type": "application/json" },
            maxRedirects: 0,
            validateStatus: (status: number) =>
              status === 200 || status === 201 || status === 302,
          }
        );
        if (res.status === 302) {
          const location = res.headers.location ?? res.headers["location"];
          return { redirect: Array.isArray(location) ? location[0] : location };
        }
        return { success: res.data };
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.log(JSON.stringify(err.response?.data, null, 2));
        }
      }
    },
  });

  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => setSubmitError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  useEffect(() => {
    const closeAt = form?.settings?.closeAt;
    const id = setTimeout(() => {
      if (closeAt != null) {
        setIsPastCloseTime(Date.now() > closeAt);
      } else {
        setIsPastCloseTime(false);
      }
    }, 0);
    return () => clearTimeout(id);
  }, [form?.settings?.closeAt]);

  if (form === undefined) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        Loading form…
      </div>
    );
  }

  if (form === null) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Form not found ❌
        </h1>
        <p className="mt-2 text-muted-foreground">
          This form may have been deleted or the link may be incorrect.
        </p>
      </div>
    );
  }

  if (form.isClosed) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">{form.title}</h1>
        <p className="mt-2 text-muted-foreground">This form is closed.</p>
      </div>
    );
  }

  if (form.settings?.closeAt != null && isPastCloseTime) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">{form.title}</h1>
        <p className="mt-2 text-muted-foreground">This form has closed.</p>
      </div>
    );
  }

  if (submitted) {
    const msg =
      form.settings?.confirmationMessage ??
      "Your response has been recorded. Thank you!";
    const redirectUrl = form.settings?.redirectUrl;
    if (redirectUrl) {
      router.push(redirectUrl);
      return (
        <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
          Redirecting…
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">{form.title}</h1>
        <p className="mt-4 text-muted-foreground">{msg}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {submitError && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">{submitError}</p>
        </div>
      )}
      <FormFillerForm
        key={form._id}
        form={form}
        setSubmitted={setSubmitted}
        setSubmitError={setSubmitError}
        submitMutation={submitMutation}
      />
    </div>
  );
}
