"use client";

import { useQuery, useMutation } from "@repo/convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { useForm } from "react-hook-form";
import { Button } from "@repo/design-system/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Question = {
  id: string;
  type: string;
  title: string;
  required: boolean;
  options?: string[];
  inputType?: "text" | "email" | "phone" | "number";
  ratingMax?: number;
};

type FormData = Record<string, string | string[]>;

interface FormFillerProps {
  formIdOrSlug: string;
}

const inputClass =
  "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function FormFiller({ formIdOrSlug }: FormFillerProps) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isPastCloseTime, setIsPastCloseTime] = useState<boolean | null>(null);

  const formBySlug = useQuery(api.forms.getBySlug, { slug: formIdOrSlug });
  const formById = useQuery(
    api.forms.get,
    formBySlug === null ? { formId: formIdOrSlug as Id<"forms"> } : "skip"
  );

  const form = formBySlug ?? (formBySlug === null ? formById : undefined);

  const submitResponse = useMutation(api.responses.submit);

  const defaultValues: FormData = {};
  for (const q of form?.questions ?? []) {
    if (q.type === "checkboxes") defaultValues[q.id] = [];
    else defaultValues[q.id] = "";
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<FormData>({
    defaultValues,
    mode: "onBlur",
  });

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
          Form not found
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
    for (const q of form.questions) {
      if (q.type === "checkboxes" && q.required) {
        const val = data[q.id];
        if (!Array.isArray(val) || val.length === 0) {
          setError(q.id, { message: "Select at least one" });
          return;
        }
      }
    }
    const answers: Record<string, string | string[] | number> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === "") continue;
      if (Array.isArray(value) && value.length === 0) continue;
      const question = form.questions.find((q) => q.id === key);
      if (question?.type === "star_rating" && typeof value === "string") {
        const n = parseInt(value, 10);
        if (!Number.isNaN(n)) answers[key] = n;
      } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        answers[key] = new Date(value).getTime();
      } else {
        answers[key] = value;
      }
    }

    await submitResponse({
      formId: form._id,
      answers,
    });
    setSubmitted(true);
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
        {form.questions.map((q) => (
          <QuestionField
            key={q.id}
            question={q}
            register={register}
            setValue={setValue}
            watch={watch}
            setError={setError}
            clearErrors={clearErrors}
            error={errors[q.id]}
          />
        ))}
      </div>

      <div className="mt-6 pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit"}
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
}: {
  id: string;
  inputType: "text" | "email" | "phone" | "number";
  required: boolean;
  register: ReturnType<typeof useForm<FormData>>["register"];
  error: { message?: string } | undefined;
}) {
  const htmlType =
    inputType === "email"
      ? "email"
      : inputType === "number"
        ? "number"
        : "text";
  const placeholder =
    inputType === "email"
      ? "you@example.com"
      : inputType === "phone"
        ? "+1 (555) 000-0000"
        : "Your answer";

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
    return true;
  };

  return (
    <input
      {...register(id, { validate })}
      type={htmlType}
      placeholder={placeholder}
      className={inputClass}
      aria-invalid={!!error}
    />
  );
}

function QuestionField({
  question,
  register,
  setValue,
  watch,
  setError,
  clearErrors,
  error,
}: {
  question: Question;
  register: ReturnType<typeof useForm<FormData>>["register"];
  setValue: ReturnType<typeof useForm<FormData>>["setValue"];
  watch: ReturnType<typeof useForm<FormData>>["watch"];
  setError: ReturnType<typeof useForm<FormData>>["setError"];
  clearErrors: ReturnType<typeof useForm<FormData>>["clearErrors"];
  error: { message?: string } | undefined;
}) {
  const { id, type, title, required, options = [] } = question;

  const label = (
    <label className="block text-sm font-medium text-foreground">
      {title || "(Untitled question)"}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  );

  return (
    <div className="space-y-2">
      {label}

      {type === "short_text" && (
        <ShortTextInput
          id={id}
          inputType={question.inputType ?? "text"}
          required={required}
          register={register}
          error={error}
        />
      )}

      {type === "long_text" && (
        <textarea
          {...register(id, {
            required: required ? "This field is required" : false,
          })}
          rows={3}
          placeholder="Your answer"
          className={inputClass}
        />
      )}

      {type === "multiple_choice" && (
        <div className="space-y-2">
          {options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2 text-foreground">
              <input
                type="radio"
                {...register(id, {
                  required: required ? "Select an option" : false,
                })}
                value={opt}
                className="rounded-full border-input"
              />
              <span>{opt || `Option ${i + 1}`}</span>
            </label>
          ))}
        </div>
      )}

      {type === "checkboxes" && (
        <CheckboxGroup
          name={id}
          options={options}
          required={required}
          setValue={setValue}
          watch={watch}
          setError={setError}
          clearErrors={clearErrors}
        />
      )}

      {type === "dropdown" && (
        <select
          {...register(id, { required: required ? "Choose an option" : false })}
          className={inputClass}
        >
          <option value="">Choose</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt || `Option ${i + 1}`}
            </option>
          ))}
        </select>
      )}

      {type === "date" && (
        <input
          {...register(id, {
            required: required ? "This field is required" : false,
          })}
          type="date"
          className={inputClass}
        />
      )}

      {type === "star_rating" && (
        <StarRatingInput
          id={id}
          max={Math.min(10, Math.max(3, question.ratingMax ?? 5))}
          required={required}
          register={register}
          setValue={setValue}
          watch={watch}
        />
      )}

      {error && (
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
  register,
  setValue,
  watch,
}: {
  id: string;
  max: number;
  required: boolean;
  register: ReturnType<typeof useForm<FormData>>["register"];
  setValue: ReturnType<typeof useForm<FormData>>["setValue"];
  watch: ReturnType<typeof useForm<FormData>>["watch"];
}) {
  const value = watch(id) as string | undefined;
  const selected = value ? parseInt(value, 10) : 0;
  const [hover, setHover] = useState(0);

  const validate = (v: string | string[]) => {
    const val = typeof v === "string" ? v : "";
    if (!val && !required) return true;
    if (required && !val) return "Please select a rating";
    const n = parseInt(val, 10);
    if (Number.isNaN(n) || n < 1 || n > max)
      return `Please select between 1 and ${max}`;
    return true;
  };

  return (
    <div className="flex flex-col gap-1">
      <input
        type="hidden"
        {...register(id, { validate })}
      />
      <div
        className="flex gap-1"
        role="group"
        aria-label={`Rate from 1 to ${max} stars`}
      >
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(id, String(star), { shouldValidate: true })}
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
    </div>
  );
}

function CheckboxGroup({
  name,
  options,
  required,
  setValue,
  watch,
  setError,
  clearErrors,
}: {
  name: string;
  options: string[];
  required: boolean;
  setValue: ReturnType<typeof useForm<FormData>>["setValue"];
  watch: ReturnType<typeof useForm<FormData>>["watch"];
  setError: ReturnType<typeof useForm<FormData>>["setError"];
  clearErrors: ReturnType<typeof useForm<FormData>>["clearErrors"];
}) {
  const value = watch(name) as string[] | undefined;
  const arr = Array.isArray(value) ? value : [];

  const toggle = (opt: string) => {
    clearErrors(name);
    const next = arr.includes(opt)
      ? arr.filter((o) => o !== opt)
      : [...arr, opt];
    setValue(name, next);
  };

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <label key={i} className="flex items-center gap-2 text-foreground">
          <input
            type="checkbox"
            checked={arr.includes(opt)}
            onChange={() => toggle(opt)}
            className="rounded border-input"
          />
          <span>{opt || `Option ${i + 1}`}</span>
        </label>
      ))}
    </div>
  );
}
