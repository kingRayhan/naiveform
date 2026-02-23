import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FormBlock, InputBlock, ContentBlock } from "@repo/types";
import {
  INPUT_BLOCK_TYPES,
  CONTENT_BLOCK_TYPES,
  createEmptyInputBlock,
  createEmptyContentBlock,
} from "@repo/types";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@repo/design-system/button";

interface SortableBlockItemProps {
  block: FormBlock;
  onUpdate: (id: string, updates: Partial<FormBlock>) => void;
  onRemove: (id: string) => void;
}

const inputClass =
  "w-full px-2.5 py-1.5 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm";

function slugFromTitle(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function SortableBlockItem({
  block,
  onUpdate,
  onRemove,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditingFieldId, setIsEditingFieldId] = useState(false);
  const [fieldIdDraft, setFieldIdDraft] = useState(block.id);
  const fieldIdValue = isEditingFieldId ? fieldIdDraft : block.id;
  const [showSettings, setShowSettings] = useState(false);

  if (block.kind === "content") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`rounded-lg border border-border bg-card px-3 py-2 shadow-sm ${isDragging ? "z-50 opacity-90 shadow-md" : ""}`}
      >
        <div className="flex gap-2">
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className="mt-1 flex cursor-grab touch-none flex-col gap-0.5 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </button>
          <div className="min-w-0 flex-1 space-y-1.5">
            <select
              value={block.type}
              onChange={(e) => {
                const newType = e.target.value as ContentBlock["type"];
                const fresh = createEmptyContentBlock(block.id, newType);
                onUpdate(block.id, fresh);
              }}
              className={`${inputClass} w-auto min-w-[140px]`}
            >
              {CONTENT_BLOCK_TYPES.map(({ type, label }) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
            {block.type === "heading" && (
              <>
                <input
                  type="text"
                  value={"text" in block ? block.text : ""}
                  onChange={(e) => onUpdate(block.id, { text: e.target.value })}
                  placeholder="Heading text"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowSettings((s) => !s)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showSettings ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                  {showSettings ? "Hide settings" : "Show settings"}
                </button>
                {showSettings && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Level:</span>
                    <select
                      value={"settings" in block && block.settings?.level ? block.settings.level : 1}
                      onChange={(e) =>
                        onUpdate(block.id, {
                          settings: {
                            ...("settings" in block ? block.settings : undefined),
                            level: parseInt(e.target.value, 10) as 1 | 2 | 3 | 4 | 5 | 6,
                          },
                        })
                      }
                      className={`${inputClass} w-auto min-w-[80px]`}
                    >
                      {([1, 2, 3, 4, 5, 6] as const).map((n) => (
                        <option key={n} value={n}>H{n}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
            {block.type === "paragraph" && (
              <>
                <textarea
                  value={"content" in block ? block.content : ""}
                  onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                  placeholder="Paragraph content"
                  rows={2}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowSettings((s) => !s)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showSettings ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                  {showSettings ? "Hide settings" : "Show settings"}
                </button>
                {showSettings && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-xs">Align:</span>
                    <select
                      value={"settings" in block && block.settings?.align ? block.settings.align : "left"}
                      onChange={(e) =>
                        onUpdate(block.id, {
                          settings: {
                            ...("settings" in block ? block.settings : undefined),
                            align: e.target.value as "left" | "center" | "right",
                          },
                        })
                      }
                      className={`${inputClass} w-auto min-w-[100px]`}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                    <span className="text-muted-foreground text-xs">Size:</span>
                    <select
                      value={"settings" in block && block.settings?.fontSize ? block.settings.fontSize : "medium"}
                      onChange={(e) =>
                        onUpdate(block.id, {
                          settings: {
                            ...("settings" in block ? block.settings : undefined),
                            fontSize: e.target.value as "small" | "medium" | "large",
                          },
                        })
                      }
                      className={`${inputClass} w-auto min-w-[100px]`}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                )}
              </>
            )}
            {block.type === "image" && (
              <>
                <input
                  type="url"
                  value={"imageUrl" in block ? block.imageUrl : ""}
                  onChange={(e) => onUpdate(block.id, { imageUrl: e.target.value })}
                  placeholder="Image URL"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowSettings((s) => !s)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showSettings ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                  {showSettings ? "Hide settings" : "Show settings"}
                </button>
                {showSettings && (
                  <div>
                    <span className="text-muted-foreground text-xs block mb-0.5">Alt text (accessibility):</span>
                    <input
                      type="text"
                      value={"settings" in block && block.settings?.alt ? block.settings.alt : ""}
                      onChange={(e) =>
                        onUpdate(block.id, {
                          settings: {
                            ...("settings" in block ? block.settings : undefined),
                            alt: e.target.value || undefined,
                          },
                        })
                      }
                      placeholder="Describe the image"
                      className={inputClass}
                    />
                  </div>
                )}
              </>
            )}
            {block.type === "youtube_embed" && (
              <input
                type="text"
                value={"youtubeVideoId" in block ? block.youtubeVideoId : ""}
                onChange={(e) =>
                  onUpdate(block.id, { youtubeVideoId: e.target.value })
                }
                placeholder="YouTube video ID"
                className={inputClass}
              />
            )}
            {block.type === "divider" && (
              <>
                <button
                  type="button"
                  onClick={() => setShowSettings((s) => !s)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showSettings ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                  {showSettings ? "Hide settings" : "Show settings"}
                </button>
                {showSettings && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-xs">Color:</span>
                    <select
                      value={"settings" in block && block.settings?.color ? block.settings.color : "light"}
                      onChange={(e) =>
                        onUpdate(block.id, {
                          settings: {
                            ...("settings" in block ? block.settings : undefined),
                            color: e.target.value as "light" | "dark",
                          },
                        })
                      }
                      className={`${inputClass} w-auto min-w-[100px]`}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                    <span className="text-muted-foreground text-xs">Thickness:</span>
                    <select
                      value={"settings" in block && block.settings?.thickness ? block.settings.thickness : "medium"}
                      onChange={(e) =>
                        onUpdate(block.id, {
                          settings: {
                            ...("settings" in block ? block.settings : undefined),
                            thickness: e.target.value as "thin" | "medium" | "thick",
                          },
                        })
                      }
                      className={`${inputClass} w-auto min-w-[100px]`}
                    >
                      <option value="thin">Thin</option>
                      <option value="medium">Medium</option>
                      <option value="thick">Thick</option>
                    </select>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onRemove(block.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Input block
  const q = block as InputBlock;
  const hasOptions =
    q.type === "radio" || q.type === "checkbox" || q.type === "dropdown";
  const options = "options" in q ? q.options ?? [] : [];
  const required = q.settings?.required ?? false;

  const handleTypeChange = (newType: InputBlock["type"]) => {
    const fresh = createEmptyInputBlock(block.id, newType);
    fresh.title = q.title;
    fresh.description = q.description;
    fresh.settings = { ...q.settings, required };
    onUpdate(block.id, fresh);
  };

  const setOption = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    onUpdate(block.id, { options: next });
  };

  const addOption = () => {
    const next = [...options, `Option ${options.length + 1}`];
    onUpdate(block.id, { options: next });
  };

  const removeOption = (index: number) => {
    const next = options.filter((_, i) => i !== index);
    onUpdate(block.id, { options: next.length ? next : [] });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-border bg-card px-3 py-2 shadow-sm ${isDragging ? "z-50 opacity-90 shadow-md" : ""}`}
    >
      <div className="flex gap-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="mt-1 flex cursor-grab touch-none flex-col gap-0.5 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={q.title}
              onChange={(e) => onUpdate(block.id, { title: e.target.value })}
              onBlur={() => {
                const slug = slugFromTitle(q.title);
                if (slug) onUpdate(block.id, { id: slug });
              }}
              placeholder="Question title"
              className={inputClass}
            />
            <select
              value={q.type}
              onChange={(e) =>
                handleTypeChange(e.target.value as InputBlock["type"])
              }
              className={`${inputClass} w-auto min-w-[140px]`}
            >
              {INPUT_BLOCK_TYPES.map(({ type, label }) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-muted-foreground text-xs block mb-0.5">Description (optional)</label>
            <input
              type="text"
              value={q.description ?? ""}
              onChange={(e) => onUpdate(block.id, { description: e.target.value || undefined })}
              placeholder="Helper text shown below the question"
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              Field ID:
            </span>
            <input
              type="text"
              value={fieldIdValue}
              onFocus={() => {
                setFieldIdDraft(block.id);
                setIsEditingFieldId(true);
              }}
              onChange={(e) => setFieldIdDraft(e.target.value)}
              onBlur={() => {
                onUpdate(block.id, { id: fieldIdDraft });
                setIsEditingFieldId(false);
              }}
              placeholder="e.g. email, full_name"
              className={`${inputClass} max-w-[200px] font-mono text-sm`}
            />
            <span className="relative flex group">
              <button
                type="button"
                className="rounded p-0.5 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Why Field ID is needed"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              <span className="absolute left-0 bottom-full z-50 mb-1.5 hidden w-[min(280px,90vw)] rounded-md border border-border bg-popover px-3 py-2 shadow-md group-hover:block">
                <span className="text-xs text-foreground">
                  Stable key for this field. Used in headless HTML/API submissions.
                </span>
              </span>
            </span>
          </div>

          {hasOptions && (
            <div className="space-y-1.5 pl-0">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {q.type === "radio" ? "○" : q.type === "checkbox" ? "☐" : "▾"}
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => setOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove option"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                + Add option
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {showSettings ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            {showSettings ? "Hide settings" : "Show settings"}
          </button>

          {showSettings && (
            <>
          {/* Placeholder for option-based / other inputs that don't have the full Settings box */}
          {(q.type === "radio" || q.type === "dropdown" || q.type === "date" || q.type === "time" || q.type === "yes_no") && (
            <div>
              <label className="text-muted-foreground text-xs block mb-0.5">Placeholder (optional)</label>
              <input
                type="text"
                value={q.settings?.placeholder ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, placeholder: e.target.value || undefined },
                  })
                }
                placeholder="e.g. Choose one"
                className={inputClass}
              />
            </div>
          )}

          {/* Common input settings: placeholder, default value */}
          {(q.type === "text" || q.type === "email" || q.type === "phone" || q.type === "url" || q.type === "long_text" || q.type === "number") && (
            <div className="rounded-md border border-border bg-muted/30 p-2 space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Settings</span>
              <div>
                <label className="text-muted-foreground text-xs block mb-0.5">Placeholder</label>
                <input
                  type="text"
                  value={q.settings?.placeholder ?? ""}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      settings: { ...q.settings, placeholder: e.target.value || undefined },
                    })
                  }
                  placeholder="e.g. Your answer"
                  className={inputClass}
                />
              </div>
              {(q.type === "text" || q.type === "email" || q.type === "phone" || q.type === "url" || q.type === "long_text") && (
                <div>
                  <label className="text-muted-foreground text-xs block mb-0.5">Default value</label>
                  <input
                    type="text"
                    value={q.settings?.defaultValue ?? ""}
                    onChange={(e) =>
                      onUpdate(block.id, {
                        settings: { ...q.settings, defaultValue: e.target.value || undefined },
                      })
                    }
                    placeholder="Pre-filled value (optional)"
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          )}

          {/* Text / Email / URL: minLength, maxLength */}
          {(q.type === "text" || q.type === "email" || q.type === "url") && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">Min length:</span>
              <input
                type="number"
                min={0}
                value={q.settings?.minLength ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, minLength: e.target.value ? parseInt(e.target.value, 10) : undefined },
                  })
                }
                placeholder="—"
                className={`${inputClass} w-20`}
              />
              <span className="text-muted-foreground text-xs">Max length:</span>
              <input
                type="number"
                min={0}
                value={q.settings?.maxLength ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, maxLength: e.target.value ? parseInt(e.target.value, 10) : undefined },
                  })
                }
                placeholder="—"
                className={`${inputClass} w-20`}
              />
            </div>
          )}

          {/* Long text: rows, minLength, maxLength */}
          {q.type === "long_text" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">Rows:</span>
              <input
                type="number"
                min={1}
                max={20}
                value={q.settings?.rows ?? 3}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, rows: parseInt(e.target.value, 10) || 3 },
                  })
                }
                className={`${inputClass} w-16`}
              />
              <span className="text-muted-foreground text-xs">Min length:</span>
              <input
                type="number"
                min={0}
                value={q.settings?.minLength ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, minLength: e.target.value ? parseInt(e.target.value, 10) : undefined },
                  })
                }
                placeholder="—"
                className={`${inputClass} w-20`}
              />
              <span className="text-muted-foreground text-xs">Max length:</span>
              <input
                type="number"
                min={0}
                value={q.settings?.maxLength ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, maxLength: e.target.value ? parseInt(e.target.value, 10) : undefined },
                  })
                }
                placeholder="—"
                className={`${inputClass} w-20`}
              />
            </div>
          )}

          {/* Checkbox: allowOther, minSelections, maxSelections, placeholder */}
          {q.type === "checkbox" && (
            <div className="rounded-md border border-border bg-muted/30 p-2 space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Settings</span>
              <div>
                <label className="text-muted-foreground text-xs block mb-0.5">Placeholder (optional)</label>
                <input
                  type="text"
                  value={q.settings?.placeholder ?? ""}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      settings: { ...q.settings, placeholder: e.target.value || undefined },
                    })
                  }
                  placeholder="e.g. Select all that apply"
                  className={inputClass}
                />
              </div>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={q.settings?.allowOther ?? false}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      settings: { ...q.settings, allowOther: e.target.checked },
                    })
                  }
                  className="rounded border-input"
                />
                Allow "Other" option
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs">Min selections:</span>
                <input
                  type="number"
                  min={0}
                  value={q.settings?.minSelections ?? ""}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      settings: { ...q.settings, minSelections: e.target.value ? parseInt(e.target.value, 10) : undefined },
                    })
                  }
                  placeholder="—"
                  className={`${inputClass} w-20`}
                />
                <span className="text-muted-foreground text-xs">Max selections:</span>
                <input
                  type="number"
                  min={0}
                  value={q.settings?.maxSelections ?? ""}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      settings: { ...q.settings, maxSelections: e.target.value ? parseInt(e.target.value, 10) : undefined },
                    })
                  }
                  placeholder="—"
                  className={`${inputClass} w-20`}
                />
              </div>
            </div>
          )}

          {/* Date / DateTime: minDate, maxDate */}
          {(q.type === "date" || q.type === "datetime") && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">Min date:</span>
              <input
                type="date"
                value={q.settings?.minDate ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, minDate: e.target.value || undefined },
                  })
                }
                className={inputClass}
              />
              <span className="text-muted-foreground text-xs">Max date:</span>
              <input
                type="date"
                value={q.settings?.maxDate ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, maxDate: e.target.value || undefined },
                  })
                }
                className={inputClass}
              />
            </div>
          )}

          {/* Number: min, max, step */}
          {q.type === "number" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">Min:</span>
              <input
                type="number"
                value={q.settings?.min ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, min: e.target.value === "" ? undefined : parseFloat(e.target.value) },
                  })
                }
                placeholder="—"
                className={`${inputClass} w-24`}
              />
              <span className="text-muted-foreground text-xs">Max:</span>
              <input
                type="number"
                value={q.settings?.max ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, max: e.target.value === "" ? undefined : parseFloat(e.target.value) },
                  })
                }
                placeholder="—"
                className={`${inputClass} w-24`}
              />
              <span className="text-muted-foreground text-xs">Step:</span>
              <input
                type="number"
                value={q.settings?.step ?? ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, step: e.target.value === "" ? undefined : parseFloat(e.target.value) },
                  })
                }
                placeholder="—"
                className={`${inputClass} w-24`}
              />
            </div>
          )}

          {q.type === "star_rating" && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs flex-none">
                Max stars:
              </span>
              <select
                value={q.settings?.ratingMax ?? 5}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: {
                      ...q.settings,
                      ratingMax: parseInt(e.target.value, 10),
                    },
                  })
                }
                className={`${inputClass} w-auto min-w-[80px]`}
              >
                {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          {q.type === "linear_scale" && "settings" in q && q.settings && (
            <div className="rounded-md border border-border bg-muted/30 p-2 space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Scale</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs">Min:</span>
                <input
                  type="number"
                  value={q.settings.min}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      settings: { ...q.settings, min: parseInt(e.target.value, 10) || 1 },
                    })
                  }
                  className={`${inputClass} w-20`}
                />
                <span className="text-muted-foreground text-xs">Max:</span>
                <input
                  type="number"
                  value={q.settings.max}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      settings: { ...q.settings, max: parseInt(e.target.value, 10) || 5 },
                    })
                  }
                  className={`${inputClass} w-20`}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs">Min label:</span>
                <input
                  type="text"
                  value={q.settings.minLabel ?? ""}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      settings: { ...q.settings, minLabel: e.target.value || undefined },
                    })
                  }
                  placeholder="e.g. Not at all"
                  className={inputClass}
                />
                <span className="text-muted-foreground text-xs">Max label:</span>
                <input
                  type="text"
                  value={q.settings.maxLabel ?? ""}
                  onChange={(e) =>
                    onUpdate(block.id, {
                      settings: { ...q.settings, maxLabel: e.target.value || undefined },
                    })
                  }
                  placeholder="e.g. Very likely"
                  className={inputClass}
                />
              </div>
            </div>
          )}
            </>
          )}

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) =>
                  onUpdate(block.id, {
                    settings: { ...q.settings, required: e.target.checked },
                  })
                }
                className="rounded border-input"
              />
              Required
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onRemove(block.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
