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

export interface FormPreviewProps {
  blocks: FormBlock[];
  formTitle?: string;
  formDescription?: string;
}

export function FormPreview({
  blocks,
  formTitle = "Untitled form",
  formDescription,
}: FormPreviewProps) {
  const inputClass = defaultInputClass;

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-foreground">{formTitle}</h1>
        {formDescription && (
          <p className="mt-2 text-muted-foreground">{formDescription}</p>
        )}
      </div>

      <div className="space-y-6">
        {blocks.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No blocks yet. Add input or content in the Editor tab.
          </p>
        ) : (
          blocks.map((block) => {
            if (block.kind === "content") {
              return (
                <div key={block.id}>
                  <ContentBlockRenderer block={block} />
                </div>
              );
            }

            const q = block as InputBlock;
            const required = q.settings?.required ?? false;

            return (
              <div key={q.id} className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  {q.title || "(Untitled question)"}
                  {required && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </label>
                {q.description && (
                  <p className="text-sm text-muted-foreground">{q.description}</p>
                )}

                {q.type === "text" && (
                  <TextInput block={q} className={inputClass} />
                )}
                {q.type === "email" && (
                  <EmailInput block={q} className={inputClass} />
                )}
                {q.type === "phone" && (
                  <PhoneInput block={q} className={inputClass} />
                )}
                {q.type === "url" && (
                  <UrlInput block={q} className={inputClass} />
                )}
                {q.type === "long_text" && (
                  <LongTextInput block={q} className={inputClass} />
                )}
                {q.type === "radio" && <RadioInput block={q} />}
                {q.type === "checkbox" && <CheckboxInput block={q} />}
                {q.type === "dropdown" && (
                  <DropdownInput block={q} className={inputClass} />
                )}
                {(q.type === "date" ||
                  q.type === "time" ||
                  q.type === "datetime") && (
                  <DateTimeInput block={q} className={inputClass} />
                )}
                {q.type === "number" && (
                  <NumberInput block={q} className={inputClass} />
                )}
                {q.type === "star_rating" && <StarRatingInput block={q} />}
                {q.type === "linear_scale" && "settings" in q && q.settings && (
                  <LinearScaleInput block={q} className={inputClass} />
                )}
                {q.type === "yes_no" && <YesNoInput block={q} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
