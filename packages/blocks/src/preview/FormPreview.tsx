import React from "react";
import type { FormBlock, InputBlock } from "@repo/types";
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
                    <div
                      key={block.id}
                      className="text-muted-foreground text-sm"
                    >
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
                const vid =
                  "youtubeVideoId" in block ? block.youtubeVideoId : "";
                if (!vid)
                  return (
                    <div
                      key={block.id}
                      className="text-muted-foreground text-sm"
                    >
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

            const q = block as InputBlock;
            const required = q.settings?.required ?? false;
            const options = "options" in q ? q.options ?? [] : [];

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
                  <TextInput
                    id={q.id}
                    placeholder={q.settings?.placeholder}
                    className={inputClass}
                    disabled
                  />
                )}
                {q.type === "email" && (
                  <EmailInput
                    id={q.id}
                    placeholder={q.settings?.placeholder}
                    className={inputClass}
                    disabled
                  />
                )}
                {q.type === "phone" && (
                  <PhoneInput
                    id={q.id}
                    placeholder={q.settings?.placeholder}
                    className={inputClass}
                    disabled
                  />
                )}
                {q.type === "url" && (
                  <UrlInput
                    id={q.id}
                    placeholder={q.settings?.placeholder}
                    className={inputClass}
                    disabled
                  />
                )}

                {q.type === "long_text" && (
                  <LongTextInput
                    id={q.id}
                    placeholder={q.settings?.placeholder ?? "Your answer"}
                    rows={q.settings?.rows ?? 3}
                    className={inputClass}
                    disabled
                  />
                )}

                {q.type === "radio" && (
                  <RadioInput id={q.id} options={options} disabled />
                )}

                {q.type === "checkbox" && (
                  <CheckboxInput id={q.id} options={options} disabled />
                )}

                {q.type === "dropdown" && (
                  <DropdownInput
                    id={q.id}
                    options={options}
                    placeholder={q.settings?.placeholder ?? "Choose"}
                    className={inputClass}
                    disabled
                  />
                )}

                {(q.type === "date" ||
                  q.type === "time" ||
                  q.type === "datetime") && (
                  <DateTimeInput
                    id={q.id}
                    type={q.type}
                    placeholder={q.settings?.placeholder}
                    className={inputClass}
                    disabled
                  />
                )}

                {q.type === "number" && (
                  <NumberInput
                    id={q.id}
                    placeholder={q.settings?.placeholder}
                    className={inputClass}
                    disabled
                  />
                )}

                {q.type === "star_rating" && (
                  <StarRatingInput
                    id={q.id}
                    max={q.settings?.ratingMax ?? 5}
                    disabled
                  />
                )}

                {q.type === "linear_scale" &&
                  "settings" in q &&
                  q.settings && (
                    <LinearScaleInput
                      min={q.settings.min ?? 0}
                      max={q.settings.max ?? 5}
                      minLabel={q.settings.minLabel}
                      maxLabel={q.settings.maxLabel}
                      disabled
                    />
                  )}

                {q.type === "yes_no" && (
                  <YesNoInput id={q.id} disabled />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
