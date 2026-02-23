"use client";

import {
  CheckboxInput,
  ContentBlockRenderer,
  DateTimeInput,
  defaultInputClass,
  DropdownInput,
  EmailInput,
  LinearScaleInput,
  LongTextInput,
  NumberInput,
  PhoneInput,
  RadioInput,
  StarRatingInput,
  TextInput,
  UrlInput,
  YesNoInput,
} from "@repo/blocks";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { useQuery } from "@repo/convex/react";
import { Button } from "@repo/design-system/button";
import type { InputBlock, SubmitFormSuccess } from "@repo/types";
import { getFormBlocks, isInputBlock } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = Record<string, string | string[]>;

interface FormFillerProps {
  formIdOrSlug: string;
}

const inputClass = defaultInputClass;

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

  const defaultValues: FormData = {};
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
  } = useForm<FormData>({
    defaultValues,
    mode: "onBlur",
  });

  // Apply default values once when form/blocks first load (e.g. after async fetch)
  const defaultsAppliedRef = useRef(false);
  useEffect(() => {
    if (inputBlocks.length > 0 && !defaultsAppliedRef.current) {
      defaultsAppliedRef.current = true;
      const initial: FormData = {};
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

  // Clear submit error when user interacts with the form
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

  const onSubmit = async (data: FormData) => {
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
      <div className="mb-6 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-foreground">{form.title}</h1>
        {form.description && (
          <p className="mt-2 text-muted-foreground">{form.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {blocks.map((block) => {
          if (block.kind === "content") {
            return (
              <div key={block.id}>
                <ContentBlockRenderer block={block} />
              </div>
            );
          }
          return (
            <InputBlockField
              key={block.id}
              block={block}
              register={register}
              control={control}
              setValue={setValue}
              watch={watch}
              clearErrors={clearErrors}
              error={errors[block.id]}
            />
          );
        })}
      </div>

      {submitError && (
        <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">{submitError}</p>
        </div>
      )}

      <div className="mt-6 pt-6">
        <Button
          type="submit"
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

function InputBlockField({
  block,
  register,
  control,
  setValue,
  watch,
  clearErrors,
  error,
}: {
  block: InputBlock;
  register: ReturnType<typeof useForm<FormData>>["register"];
  control: ReturnType<typeof useForm<FormData>>["control"];
  setValue: ReturnType<typeof useForm<FormData>>["setValue"];
  watch: ReturnType<typeof useForm<FormData>>["watch"];
  clearErrors: ReturnType<typeof useForm<FormData>>["clearErrors"];
  error: { message?: string } | undefined;
}) {
  const { id, type, title } = block;
  const required = block.settings?.required ?? false;
  const labelId = `${id}-label`;
  const singleInputTypes = [
    "text",
    "phone",
    "url",
    "email",
    "long_text",
    "dropdown",
    "date",
    "time",
    "datetime",
    "number",
  ];
  const hasSingleInput =
    singleInputTypes.includes(type) ||
    (type === "linear_scale" && "settings" in block);

  const label = (
    <label
      id={labelId}
      htmlFor={hasSingleInput ? id : undefined}
      className="block text-sm font-medium text-foreground"
    >
      {title || "(Untitled question)"}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  );

  return (
    <div className="space-y-2">
      {label}
      {block.description && (
        <p className="text-sm text-muted-foreground">{block.description}</p>
      )}

      {type === "text" && (
        <TextInput block={block} register={register as never} error={error} className={inputClass} />
      )}
      {type === "phone" && (
        <PhoneInput block={block} register={register as never} error={error} className={inputClass} />
      )}
      {type === "url" && (
        <UrlInput block={block} register={register as never} error={error} className={inputClass} />
      )}
      {type === "email" && (
        <EmailInput block={block} register={register as never} error={error} className={inputClass} />
      )}
      {type === "long_text" && (
        <LongTextInput block={block} register={register as never} error={error} className={inputClass} />
      )}
      {type === "radio" && (
        <RadioInput block={block} register={register as never} error={error} />
      )}
      {type === "checkbox" && (
        <CheckboxInput
          block={block}
          control={control as never}
          setValue={setValue as never}
          watch={watch as never}
          clearErrors={clearErrors as never}
          error={error}
        />
      )}
      {type === "dropdown" && (
        <DropdownInput block={block} register={register as never} error={error} className={inputClass} />
      )}
      {(type === "date" || type === "time" || type === "datetime") && (
        <DateTimeInput block={block} register={register as never} error={error} className={inputClass} />
      )}
      {type === "number" && (
        <NumberInput block={block} register={register as never} error={error} className={inputClass} />
      )}
      {type === "star_rating" && (
        <StarRatingInput block={block} control={control as never} labelId={labelId} />
      )}
      {type === "linear_scale" && "settings" in block && block.settings && (
        <LinearScaleInput
          block={block}
          register={register as never}
          error={error}
          className={`${inputClass} w-20`}
        />
      )}
      {type === "yes_no" && (
        <YesNoInput block={block} register={register as never} error={error} />
      )}

      {type !== "star_rating" && error && (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
