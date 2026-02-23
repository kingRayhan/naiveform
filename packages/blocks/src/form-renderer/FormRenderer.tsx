import type { FormBlock, InputBlock } from "@repo/types";
import { ContentBlockRenderer } from "../contents";
import {
  CheckboxInput,
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
} from "../inputs";
import type {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export type FormRendererValues = Record<string, string | string[]>;

export interface FormRendererProps {
  blocks: FormBlock[];
  formTitle?: string;
  formDescription?: string;
  register: UseFormRegister<FormRendererValues>;
  control: Control<FormRendererValues>;
  errors: FieldErrors<FormRendererValues>;
  setValue: UseFormSetValue<FormRendererValues>;
  watch: UseFormWatch<FormRendererValues>;
  clearErrors: UseFormClearErrors<FormRendererValues>;
  /** Optional class for the container (e.g. space-y-6). */
  className?: string;
}

const inputClass = defaultInputClass;

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
  register: FormRendererProps["register"];
  control: FormRendererProps["control"];
  setValue: FormRendererProps["setValue"];
  watch: FormRendererProps["watch"];
  clearErrors: FormRendererProps["clearErrors"];
  error: { message?: string } | undefined;
}) {
  const { id, type, title } = block;
  const required = block.settings?.required ?? false;
  const labelId = `${id}-label`;
  const fieldClass = error
    ? `${inputClass} border-destructive focus:ring-destructive/50`
    : inputClass;
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
        <TextInput
          block={block}
          register={register as never}
          error={error}
          className={fieldClass}
        />
      )}
      {type === "phone" && (
        <PhoneInput
          block={block}
          register={register as never}
          error={error}
          className={fieldClass}
        />
      )}
      {type === "url" && (
        <UrlInput
          block={block}
          register={register as never}
          error={error}
          className={fieldClass}
        />
      )}
      {type === "email" && (
        <EmailInput
          block={block}
          register={register as never}
          error={error}
          className={fieldClass}
        />
      )}
      {type === "long_text" && (
        <LongTextInput
          block={block}
          register={register as never}
          error={error}
          className={fieldClass}
        />
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
        <DropdownInput
          block={block}
          register={register as never}
          error={error}
          className={fieldClass}
        />
      )}
      {(type === "date" || type === "time" || type === "datetime") && (
        <DateTimeInput
          block={block}
          register={register as never}
          error={error}
          className={fieldClass}
        />
      )}
      {type === "number" && (
        <NumberInput
          block={block}
          register={register as never}
          error={error}
          className={fieldClass}
        />
      )}
      {type === "star_rating" && (
        <StarRatingInput
          block={block}
          control={control as never}
          labelId={labelId}
          error={error}
        />
      )}
      {type === "linear_scale" && "settings" in block && block.settings && (
        <LinearScaleInput
          block={block}
          register={register as never}
          error={error}
          className={`${fieldClass} w-20`}
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

export function FormRenderer({
  blocks,
  formTitle = "Untitled form",
  formDescription,
  register,
  control,
  errors,
  setValue,
  watch,
  clearErrors,
  className,
}: FormRendererProps) {
  return (
    <>
      <div className="mb-6 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-foreground">{formTitle}</h1>
        {formDescription && (
          <p className="mt-2 text-muted-foreground">{formDescription}</p>
        )}
      </div>

      <div className={className ?? "space-y-6"}>
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
    </>
  );
}
