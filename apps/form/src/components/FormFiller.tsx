"use client";

import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { useQuery } from "@repo/convex/react";
import { Button } from "@repo/design-system/button";
import type { SubmitFormSuccess } from "@repo/types";
import { getFormBlocks, isInputBlock } from "@repo/types";
import type { FormBlock, InputBlock } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type FormData = Record<string, string | string[]>;

interface FormFillerProps {
  formIdOrSlug: string;
}

const inputClass =
  "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-muted-foreground shrink-0"
    aria-hidden
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const UrlIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-muted-foreground shrink-0"
    aria-hidden
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

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
            if (block.type === "heading") {
              const level =
                "settings" in block && block.settings?.level
                  ? block.settings.level
                  : 2;
              const sizeClass =
                level === 1
                  ? "text-2xl"
                  : level === 2
                    ? "text-xl"
                    : level === 3
                      ? "text-lg"
                      : level === 4
                        ? "text-base"
                        : level === 5
                          ? "text-sm"
                          : "text-xs";
              const text = "text" in block ? block.text : "";
              return React.createElement(
                `h${level}`,
                {
                  key: block.id,
                  className: `${sizeClass} font-semibold ${text ? "text-foreground" : "text-muted-foreground"}`,
                },
                text || "Heading text"
              );
            }
            if (block.type === "paragraph") {
              const align =
                "settings" in block && block.settings?.align
                  ? block.settings.align
                  : "left";
              const fontSize =
                "settings" in block && block.settings?.fontSize
                  ? block.settings.fontSize
                  : "medium";
              const alignClass =
                align === "left"
                  ? "text-left"
                  : align === "center"
                    ? "text-center"
                    : "text-right";
              const sizeClass =
                fontSize === "small"
                  ? "text-sm"
                  : fontSize === "large"
                    ? "text-lg"
                    : "text-base";
              const content = "content" in block ? block.content : "";
              return (
                <p
                  key={block.id}
                  className={`whitespace-pre-wrap ${alignClass} ${sizeClass} ${content ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {content || "Paragraph content"}
                </p>
              );
            }
            if (block.type === "image") {
              const url = "imageUrl" in block ? block.imageUrl : "";
              if (!url)
                return (
                  <div key={block.id} className="text-muted-foreground text-sm">
                    Image
                  </div>
                );
              const alt =
                "settings" in block && block.settings?.alt
                  ? block.settings.alt
                  : "";
              return (
                <img
                  key={block.id}
                  src={url}
                  alt={alt}
                  className="max-w-full h-auto rounded-md"
                />
              );
            }
            if (block.type === "youtube_embed") {
              const vid = "youtubeVideoId" in block ? block.youtubeVideoId : "";
              if (!vid)
                return (
                  <div key={block.id} className="text-muted-foreground text-sm">
                    YouTube video
                  </div>
                );
              return (
                <div
                  key={block.id}
                  className="aspect-video rounded-md overflow-hidden bg-muted"
                >
                  <iframe
                    title="YouTube"
                    src={`https://www.youtube.com/embed/${vid}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              );
            }
            if (block.type === "divider") {
              return <hr key={block.id} className="border-border" />;
            }
            return null;
          }
          return (
            <InputBlockField
              key={block.id}
              block={block}
              register={register}
              control={control}
              setValue={setValue}
              watch={watch}
              setError={setError}
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

function ShortTextInput({
  id,
  inputType,
  required,
  register,
  error,
  placeholder: placeholderProp,
  minLength,
  maxLength,
}: {
  id: string;
  inputType: "text" | "email" | "phone" | "number";
  required: boolean;
  register: ReturnType<typeof useForm<FormData>>["register"];
  error: { message?: string } | undefined;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}) {
  const htmlType =
    inputType === "email"
      ? "email"
      : inputType === "number"
        ? "number"
        : "text";
  const defaultPlaceholder =
    inputType === "email"
      ? "you@example.com"
      : inputType === "phone"
        ? "+1 (555) 000-0000"
        : "Your answer";
  const placeholder = placeholderProp ?? defaultPlaceholder;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-+()]{10,}$/;

  const validate = (v: string | string[]) => {
    const val = typeof v === "string" ? v : "";
    if (!val && !required) return true;
    if (required && !val) return "This field is required";
    if (inputType === "email" && !emailRegex.test(val))
      return "Please enter a valid email address";
    if (inputType === "phone" && !phoneRegex.test(val))
      return "Please enter a valid phone number";
    if (inputType === "number" && val && Number.isNaN(Number(val)))
      return "Please enter a valid number";
    if (minLength != null && val.length < minLength)
      return `At least ${minLength} characters`;
    if (maxLength != null && val.length > maxLength)
      return `At most ${maxLength} characters`;
    return true;
  };

  return (
    <input
      id={id}
      {...register(id, { validate })}
      type={htmlType}
      placeholder={placeholder}
      minLength={minLength}
      maxLength={maxLength}
      className={inputClass}
      aria-invalid={!!error}
    />
  );
}

function InputBlockField({
  block,
  register,
  control,
  setValue,
  watch,
  setError,
  clearErrors,
  error,
}: {
  block: InputBlock;
  register: ReturnType<typeof useForm<FormData>>["register"];
  control: ReturnType<typeof useForm<FormData>>["control"];
  setValue: ReturnType<typeof useForm<FormData>>["setValue"];
  watch: ReturnType<typeof useForm<FormData>>["watch"];
  setError: ReturnType<typeof useForm<FormData>>["setError"];
  clearErrors: ReturnType<typeof useForm<FormData>>["clearErrors"];
  error: { message?: string } | undefined;
}) {
  const { id, type, title } = block;
  const options = "options" in block ? (block.options ?? []) : [];
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

      {(type === "text" || type === "phone" || type === "url") &&
        (() => {
          const s = block.settings as
            | { minLength?: number; maxLength?: number }
            | undefined;
          const isPhone = type === "phone";
          const isUrl = type === "url";
          const hasIcon = isPhone || isUrl;
          const inputEl = (
            <input
              id={id}
              {...register(id, {
                required: required ? "This field is required" : false,
                minLength: s?.minLength
                  ? {
                      value: s.minLength,
                      message: `At least ${s.minLength} characters`,
                    }
                  : undefined,
                maxLength: s?.maxLength
                  ? {
                      value: s.maxLength,
                      message: `At most ${s.maxLength} characters`,
                    }
                  : undefined,
              })}
              type={type === "url" ? "url" : type === "phone" ? "tel" : "text"}
              inputMode={type === "phone" ? "tel" : undefined}
              minLength={s?.minLength}
              maxLength={s?.maxLength}
              placeholder={
                block.settings?.placeholder ??
                (type === "phone" ? "+1 (555) 000-0000" : "Your answer")
              }
              className={hasIcon ? `${inputClass} pl-9` : inputClass}
              aria-invalid={!!error}
            />
          );
          if (hasIcon) {
            return (
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  {isPhone ? <PhoneIcon /> : <UrlIcon />}
                </span>
                {inputEl}
              </div>
            );
          }
          return inputEl;
        })()}

      {type === "email" && (
        <ShortTextInput
          id={id}
          inputType="email"
          required={required}
          register={register}
          error={error}
          placeholder={block.settings?.placeholder}
          minLength={(block.settings as { minLength?: number })?.minLength}
          maxLength={(block.settings as { maxLength?: number })?.maxLength}
        />
      )}

      {type === "long_text" &&
        (() => {
          const s = block.settings as
            | { minLength?: number; maxLength?: number; rows?: number }
            | undefined;
          return (
            <textarea
              id={id}
              {...register(id, {
                required: required ? "This field is required" : false,
                minLength: s?.minLength
                  ? {
                      value: s.minLength,
                      message: `At least ${s.minLength} characters`,
                    }
                  : undefined,
                maxLength: s?.maxLength
                  ? {
                      value: s.maxLength,
                      message: `At most ${s.maxLength} characters`,
                    }
                  : undefined,
              })}
              rows={s?.rows ?? 3}
              minLength={s?.minLength}
              maxLength={s?.maxLength}
              placeholder={block.settings?.placeholder ?? "Your answer"}
              className={inputClass}
            />
          );
        })()}

      {type === "radio" && (
        <div className="space-y-2" role="group" aria-labelledby={labelId}>
          {options.map((opt: string, i: number) => {
            const optionId = `${id}-option-${i}`;
            return (
              <label
                key={i}
                htmlFor={optionId}
                className="flex items-center gap-2 text-foreground"
              >
                <input
                  id={optionId}
                  type="radio"
                  {...register(id, {
                    required: required ? "Select an option" : false,
                  })}
                  value={opt}
                  className="rounded-full border-input"
                />
                <span>{opt || `Option ${i + 1}`}</span>
              </label>
            );
          })}
        </div>
      )}

      {type === "checkbox" && (
        <Controller
          name={id}
          control={control}
          rules={{
            validate: (v) => {
              const arr = Array.isArray(v) ? v : [];
              const minS = block.settings?.minSelections;
              const maxS = block.settings?.maxSelections;
              if (minS != null && arr.length < minS)
                return `Select at least ${minS} option(s)`;
              if (maxS != null && arr.length > maxS)
                return `Select at most ${maxS} option(s)`;
              return true;
            },
          }}
          render={({ field }) => (
            <CheckboxGroup
              name={id}
              fieldId={id}
              options={options}
              value={field.value as string[] | undefined}
              onChange={field.onChange}
              setValue={setValue}
              watch={watch}
              clearErrors={clearErrors}
            />
          )}
        />
      )}

      {type === "dropdown" && (
        <select
          id={id}
          {...register(id, { required: required ? "Choose an option" : false })}
          className={inputClass}
        >
          <option value="">{block.settings?.placeholder ?? "Choose"}</option>
          {options.map((opt: string, i: number) => (
            <option key={i} value={opt}>
              {opt || `Option ${i + 1}`}
            </option>
          ))}
        </select>
      )}

      {(type === "date" || type === "time" || type === "datetime") && (
        <input
          id={id}
          {...register(id, {
            required: required ? "This field is required" : false,
          })}
          type={type === "datetime" ? "datetime-local" : type}
          min={
            type !== "time" && "minDate" in (block.settings ?? {})
              ? (block.settings as { minDate?: string }).minDate
              : undefined
          }
          max={
            type !== "time" && "maxDate" in (block.settings ?? {})
              ? (block.settings as { maxDate?: string }).maxDate
              : undefined
          }
          className={inputClass}
        />
      )}

      {type === "number" && (
        <input
          id={id}
          {...register(id, {
            required: required ? "This field is required" : false,
            min:
              block.settings?.min != null
                ? {
                    value: block.settings.min,
                    message: `Minimum value is ${block.settings.min}`,
                  }
                : undefined,
            max:
              block.settings?.max != null
                ? {
                    value: block.settings.max,
                    message: `Maximum value is ${block.settings.max}`,
                  }
                : undefined,
          })}
          type="number"
          min={block.settings?.min}
          max={block.settings?.max}
          step={block.settings?.step}
          placeholder={block.settings?.placeholder}
          className={inputClass}
        />
      )}

      {type === "star_rating" && (
        <StarRatingInput
          id={id}
          max={Math.min(10, Math.max(3, block.settings?.ratingMax ?? 5))}
          required={required}
          control={control}
        />
      )}

      {type === "linear_scale" && "settings" in block && block.settings && (
        <div
          className="flex items-center gap-2 flex-wrap"
          role="group"
          aria-labelledby={labelId}
        >
          <span className="text-sm text-muted-foreground">
            {block.settings.minLabel ?? block.settings.min}
          </span>
          <input
            id={id}
            type="number"
            min={block.settings.min}
            max={block.settings.max}
            {...register(id, {
              required: block.settings.required
                ? "This field is required"
                : false,
            })}
            className={`${inputClass} w-20`}
          />
          <span className="text-sm text-muted-foreground">
            {block.settings.maxLabel ?? block.settings.max}
          </span>
        </div>
      )}

      {type === "yes_no" && (
        <div className="flex gap-4" role="group" aria-labelledby={labelId}>
          <label htmlFor={`${id}-yes`} className="flex items-center gap-2">
            <input
              id={`${id}-yes`}
              type="radio"
              {...register(id, {
                required: required ? "Select an option" : false,
              })}
              value="yes"
              className="rounded-full border-input"
            />
            <span>Yes</span>
          </label>
          <label htmlFor={`${id}-no`} className="flex items-center gap-2">
            <input
              id={`${id}-no`}
              type="radio"
              {...register(id)}
              value="no"
              className="rounded-full border-input"
            />
            <span>No</span>
          </label>
        </div>
      )}

      {type !== "star_rating" && error && (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

function StarRatingInput({
  id,
  max,
  required,
  control,
}: {
  id: string;
  max: number;
  required: boolean;
  control: ReturnType<typeof useForm<FormData>>["control"];
}) {
  const [hover, setHover] = useState(0);

  return (
    <Controller
      name={id}
      control={control}
      rules={{
        required: required ? "Please select a rating" : false,
        validate: (v) => {
          const val = typeof v === "string" ? v : "";
          if (!val && !required) return true;
          const n = parseInt(val, 10);
          if (Number.isNaN(n) || n < 1 || n > max)
            return `Please select between 1 and ${max}`;
          return true;
        },
      }}
      render={({ field, fieldState }) => {
        const selected = field.value ? parseInt(String(field.value), 10) : 0;
        return (
          <div className="flex flex-col gap-1">
            <div
              className="flex gap-1"
              role="group"
              aria-labelledby={`${id}-label`}
            >
              {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => field.onChange(String(star))}
                  onBlur={field.onBlur}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="text-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-0.5"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  {(hover || selected) >= star ? (
                    <span className="text-amber-400">★</span>
                  ) : (
                    <span className="text-muted-foreground/50">☆</span>
                  )}
                </button>
              ))}
            </div>
            {fieldState.error?.message && (
              <p className="text-sm text-destructive" role="alert">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

function CheckboxGroup({
  name,
  fieldId,
  options,
  value: valueProp,
  onChange: onChangeProp,
  setValue,
  watch,
  clearErrors,
}: {
  name: string;
  fieldId: string;
  options: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  setValue: ReturnType<typeof useForm<FormData>>["setValue"];
  watch: ReturnType<typeof useForm<FormData>>["watch"];
  clearErrors: ReturnType<typeof useForm<FormData>>["clearErrors"];
}) {
  const watched = watch(name) as string[] | undefined;
  const arr = Array.isArray(valueProp)
    ? valueProp
    : Array.isArray(watched)
      ? watched
      : [];

  const toggle = (opt: string) => {
    clearErrors(name);
    const next = arr.includes(opt)
      ? arr.filter((o) => o !== opt)
      : [...arr, opt];
    if (onChangeProp) onChangeProp(next);
    else setValue(name, next);
  };

  return (
    <div
      className="space-y-2"
      role="group"
      aria-labelledby={`${fieldId}-label`}
    >
      {options.map((opt: string, i: number) => {
        const optionId = `${fieldId}-option-${i}`;
        return (
          <label
            key={i}
            htmlFor={optionId}
            className="flex items-center gap-2 text-foreground"
          >
            <input
              id={optionId}
              type="checkbox"
              checked={arr.includes(opt)}
              onChange={() => toggle(opt)}
              className="rounded border-input"
            />
            <span>{opt || `Option ${i + 1}`}</span>
          </label>
        );
      })}
    </div>
  );
}
