import type { FormBlock, InputBlock } from "@repo/types";

interface FormPreviewProps {
  blocks: FormBlock[];
  formTitle?: string;
  formDescription?: string;
}

const inputClass =
  "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function FormPreview({
  blocks,
  formTitle = "Untitled form",
  formDescription,
}: FormPreviewProps) {
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
                const level = "settings" in block && block.settings?.level ? block.settings.level : 2;
                const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                const sizeClass =
                  level === 1 ? "text-2xl" :
                  level === 2 ? "text-xl" :
                  level === 3 ? "text-lg" :
                  level === 4 ? "text-base" :
                  level === 5 ? "text-sm" : "text-xs";
                const text = "text" in block ? block.text : "";
                return (
                  <Tag key={block.id} className={`${sizeClass} font-semibold ${text ? "text-foreground" : "text-muted-foreground"}`}>
                    {text || "Heading text"}
                  </Tag>
                );
              }
              if (block.type === "paragraph") {
                const align = "settings" in block && block.settings?.align ? block.settings.align : "left";
                const fontSize = "settings" in block && block.settings?.fontSize ? block.settings.fontSize : "medium";
                const alignClass = align === "left" ? "text-left" : align === "center" ? "text-center" : "text-right";
                const sizeClass = fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
                const content = "content" in block ? block.content : "";
                return (
                  <p key={block.id} className={`whitespace-pre-wrap ${alignClass} ${sizeClass} ${content ? "text-foreground" : "text-muted-foreground"}`}>
                    {content || "Paragraph content"}
                  </p>
                );
              }
              if (block.type === "image") {
                const url = "imageUrl" in block ? block.imageUrl : "";
                if (!url) return <div key={block.id} className="text-muted-foreground text-sm">Image</div>;
                const alt = "settings" in block && block.settings?.alt ? block.settings.alt : "";
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
                if (!vid) return <div key={block.id} className="text-muted-foreground text-sm">YouTube video</div>;
                return (
                  <div key={block.id} className="aspect-video rounded-md overflow-hidden bg-muted">
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

                {(q.type === "text" || q.type === "email" || q.type === "phone" || q.type === "url") && (
                  <input
                    type={q.type === "email" ? "email" : q.type === "url" ? "url" : "text"}
                    placeholder={
                      q.settings?.placeholder ??
                      (q.type === "email"
                        ? "you@example.com"
                        : q.type === "phone"
                          ? "+1 (555) 000-0000"
                          : "Your answer")
                    }
                    className={inputClass}
                    disabled
                    readOnly
                  />
                )}

                {q.type === "long_text" && (
                  <textarea
                    rows={q.settings?.rows ?? 3}
                    placeholder={q.settings?.placeholder ?? "Your answer"}
                    className={inputClass}
                    disabled
                    readOnly
                  />
                )}

                {q.type === "radio" && (
                  <div className="space-y-2">
                    {(q.options ?? []).map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-foreground"
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          disabled
                          className="rounded-full border-input"
                        />
                        <span>{opt || `Option ${i + 1}`}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "checkbox" && (
                  <div className="space-y-2">
                    {(q.options ?? []).map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-foreground"
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          disabled
                          className="rounded border-input"
                        />
                        <span>{opt || `Option ${i + 1}`}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "dropdown" && (
                  <select className={inputClass} disabled>
                    <option value="">{q.settings?.placeholder ?? "Choose"}</option>
                    {(q.options ?? []).map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt || `Option ${i + 1}`}
                      </option>
                    ))}
                  </select>
                )}

                {(q.type === "date" || q.type === "time" || q.type === "datetime") && (
                  <input
                    type={q.type === "datetime" ? "datetime-local" : q.type}
                    placeholder={q.settings?.placeholder}
                    className={inputClass}
                    disabled
                  />
                )}

                {q.type === "number" && (
                  <input
                    type="number"
                    placeholder={q.settings?.placeholder}
                    className={inputClass}
                    disabled
                    readOnly
                  />
                )}

                {q.type === "star_rating" && (
                  <div className="flex gap-1" aria-hidden>
                    {Array.from(
                      {
                        length: Math.min(
                          10,
                          Math.max(3, q.settings?.ratingMax ?? 5)
                        ),
                      },
                      (_, i) => (
                        <span
                          key={i}
                          className="text-2xl text-muted-foreground/50"
                          aria-hidden
                        >
                          ☆
                        </span>
                      )
                    )}
                    <span className="ml-2 text-sm text-muted-foreground">
                      (Star rating)
                    </span>
                  </div>
                )}

                {q.type === "linear_scale" && "settings" in q && q.settings && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{q.settings.minLabel ?? q.settings.min}</span>
                    <span>—</span>
                    <span>{q.settings.maxLabel ?? q.settings.max}</span>
                  </div>
                )}

                {q.type === "yes_no" && (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name={`q-${q.id}`} disabled className="rounded-full border-input" />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name={`q-${q.id}`} disabled className="rounded-full border-input" />
                      <span>No</span>
                    </label>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
