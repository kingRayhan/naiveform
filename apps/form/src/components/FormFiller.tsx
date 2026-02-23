"use client";

import { FormRenderer, type FormRendererValues } from "@repo/blocks";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { useQuery } from "@repo/convex/react";
import { Button } from "@repo/design-system/button";
import type { SubmitFormSuccess } from "@repo/types";
import { getFormBlocks, isInputBlock } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface FormFillerProps {
  formIdOrSlug: string;
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

  const blocks = form ? getFormBlocks(form) : [];
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

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<FormRendererValues>({
    defaultValues,
    mode: "onBlur",
  });

  const defaultsAppliedRef = useRef(false);
  useEffect(() => {
    if (inputBlocks.length > 0 && !defaultsAppliedRef.current) {
      defaultsAppliedRef.current = true;
      const initial: FormRendererValues = {};
      for (const b of inputBlocks) {
        if (b.type === "checkbox") initial[b.id] = [];
        else {
          const v =
            "settings" in b
              ? (b.settings as { defaultValue?: string })?.defaultValue
              : undefined;
          initial[b.id] = v ?? "";
        }
      }
      reset(initial);
    }
    // Only run when we first get blocks; inputBlocks intentionally omitted to avoid reset on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputBlocks.length, reset]);

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

  const onSubmit = async (data: FormRendererValues) => {
    for (const b of inputBlocks) {
      if (b.type === "checkbox" && b.settings?.required) {
        const val = data[b.id];
        if (!Array.isArray(val) || val.length === 0) {
          setError(b.id, { message: "Select at least one" });
          return;
        }
      }
    }

    setSubmitError(null);

    try {
      const result = await submitMutation.mutateAsync({
        payload: data,
        formId: form._id as Id<"forms">,
      });
      setSubmitted(true);
      if (result?.redirect) {
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

      {submitError && (
        <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">{submitError}</p>
        </div>
      )}

      <div className="mt-6 pt-6">
        <Button
          type="submit"
          size={"lg"}
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
