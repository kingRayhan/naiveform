// --------------------
// Base
// --------------------

export type BlockKind = "input" | "content";

export interface BaseBlock {
  id: string;
  kind: BlockKind;
  type: string;
}

// --------------------
// Input blocks
// --------------------

export interface CommonInputBlock extends BaseBlock {
  kind: "input";
  title: string;
  description?: string;
  settings?: {
    required?: boolean;
    placeholder?: string;
    defaultValue?: string;
  };
}

/** Short text: one line. */
export interface TextBlock extends CommonInputBlock {
  type: "text";
  settings?: CommonInputBlock["settings"] & {
    minLength?: number;
    maxLength?: number;
  };
}

/** Email address. */
export interface EmailBlock extends CommonInputBlock {
  type: "email";
  settings?: CommonInputBlock["settings"] & {
    minLength?: number;
    maxLength?: number;
  };
}

/** Phone number. */
export interface PhoneBlock extends CommonInputBlock {
  type: "phone";
  settings?: CommonInputBlock["settings"];
}

/** URL. */
export interface UrlBlock extends CommonInputBlock {
  type: "url";
  settings?: CommonInputBlock["settings"] & {
    minLength?: number;
    maxLength?: number;
  };
}

/** Paragraph: multi-line text. */
export interface LongTextBlock extends CommonInputBlock {
  type: "long_text";
  settings?: CommonInputBlock["settings"] & {
    rows?: number;
    minLength?: number;
    maxLength?: number;
  };
}

/** Single choice from a list — rendered as radio buttons. */
export interface RadioInputBlock extends CommonInputBlock {
  type: "radio";
  options: string[];
}

/** Multiple choices from a list (checkboxes). */
export interface CheckboxesBlock extends CommonInputBlock {
  type: "checkbox";
  options: string[];
  settings?: CommonInputBlock["settings"] & {
    allowOther?: boolean;
    minSelections?: number;
    maxSelections?: number;
  };
}

/** Single choice from a dropdown. */
export interface DropdownBlock extends CommonInputBlock {
  type: "dropdown";
  options: string[];
}

/** Date picker. */
export interface DateBlock extends CommonInputBlock {
  type: "date";
  settings?: CommonInputBlock["settings"] & {
    minDate?: string; // ISO date
    maxDate?: string;
  };
}

/** Time of day. */
export interface TimeBlock extends CommonInputBlock {
  type: "time";
}

/** Date and time. */
export interface DateTimeBlock extends CommonInputBlock {
  type: "datetime";
  settings?: CommonInputBlock["settings"] & {
    minDate?: string;
    maxDate?: string;
  };
}

/** Numeric value with optional min/max/step. */
export interface NumberBlock extends CommonInputBlock {
  type: "number";
  settings?: CommonInputBlock["settings"] & {
    min?: number;
    max?: number;
    step?: number;
  };
}

/** Star rating (e.g. 1–5). */
export interface StarRatingBlock extends CommonInputBlock {
  type: "star_rating";
  settings?: CommonInputBlock["settings"] & {
    ratingMax?: number; // default 5
  };
}

/** Linear scale (e.g. 1–5 or 0–10, NPS-style). */
export interface LinearScaleBlock extends CommonInputBlock {
  type: "linear_scale";
  settings: {
    required?: boolean;
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
  };
}

/** Yes/No or similar binary choice. */
export interface YesNoBlock extends CommonInputBlock {
  type: "yes_no";
  settings?: CommonInputBlock["settings"];
}

export type InputBlock =
  | TextBlock
  | EmailBlock
  | PhoneBlock
  | UrlBlock
  | LongTextBlock
  | RadioInputBlock
  | CheckboxesBlock
  | DropdownBlock
  | DateBlock
  | TimeBlock
  | DateTimeBlock
  | NumberBlock
  | StarRatingBlock
  | LinearScaleBlock
  | YesNoBlock;

// --------------------
// Content blocks
// --------------------

export interface ContentBlockBase extends BaseBlock {
  kind: "content";
}

export interface HeadingBlock extends ContentBlockBase {
  type: "heading";
  text: string;
  settings?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface ParagraphBlock extends ContentBlockBase {
  type: "paragraph";
  content: string;
  settings?: {
    align?: "left" | "center" | "right";
    fontSize?: "small" | "medium" | "large";
  };
}

export interface ImageBlock extends ContentBlockBase {
  type: "image";
  imageUrl: string;
  settings?: {
    alt?: string;
  };
}

export interface YouTubeEmbedBlock extends ContentBlockBase {
  type: "youtube_embed";
  youtubeVideoId: string;
}

export interface DividerBlock extends ContentBlockBase {
  type: "divider";
  settings?: {
    color?: "light" | "dark";
    thickness?: "thin" | "medium" | "thick";
  };
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | YouTubeEmbedBlock
  | DividerBlock;

// --------------------
// Union & responses
// --------------------

export type FormBlock = InputBlock | ContentBlock;

export type AnswerValue = string | string[] | number;

export interface FormResponse {
  formId: string;
  answers: Record<string, AnswerValue>; // key = input block id
}

// --------------------
// Helpers
// --------------------

export function isInputBlock(block: FormBlock): block is InputBlock {
  return block.kind === "input";
}

export function isContentBlock(block: FormBlock): block is ContentBlock {
  return block.kind === "content";
}

/** Returns form blocks for editor/filler. */
export function getFormBlocks(form: { blocks?: FormBlock[] }): FormBlock[] {
  return form.blocks ?? [];
}

const INPUT_BLOCK_TYPES: { type: InputBlock["type"]; label: string }[] = [
  { type: "text", label: "Text" },
  { type: "email", label: "Email" },
  { type: "phone", label: "Phone" },
  { type: "url", label: "URL" },
  { type: "long_text", label: "Paragraph" },
  { type: "radio", label: "Radio" },
  { type: "checkbox", label: "Checkboxes" },
  { type: "dropdown", label: "Dropdown" },
  { type: "date", label: "Date" },
  { type: "time", label: "Time" },
  { type: "datetime", label: "Date & time" },
  { type: "number", label: "Number" },
  { type: "star_rating", label: "Star rating" },
  { type: "linear_scale", label: "Linear scale" },
  { type: "yes_no", label: "Yes/No" },
];

const CONTENT_BLOCK_TYPES: { type: ContentBlock["type"]; label: string }[] = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "image", label: "Image" },
  { type: "youtube_embed", label: "YouTube" },
  { type: "divider", label: "Divider" },
];

export { INPUT_BLOCK_TYPES, CONTENT_BLOCK_TYPES };

/** Create a new input block with defaults. */
export function createEmptyInputBlock(
  id: string,
  type: InputBlock["type"] = "text"
): InputBlock {
  const base = {
    id,
    kind: "input" as const,
    type,
    title: "",
    settings: { required: false },
  };
  if (type === "radio" || type === "checkbox" || type === "dropdown") {
    return { ...base, options: ["Option 1", "Option 2"] } as InputBlock;
  }
  if (type === "linear_scale") {
    return {
      ...base,
      settings: { required: false, min: 1, max: 5 },
    } as InputBlock;
  }
  return base as InputBlock;
}

/** Create a new content block with defaults. */
export function createEmptyContentBlock(
  id: string,
  type: ContentBlock["type"] = "paragraph"
): ContentBlock {
  const base = { id, kind: "content" as const, type };
  if (type === "heading") return { ...base, text: "" } as ContentBlock;
  if (type === "paragraph") return { ...base, content: "" } as ContentBlock;
  if (type === "image") return { ...base, imageUrl: "" } as ContentBlock;
  if (type === "youtube_embed")
    return { ...base, youtubeVideoId: "" } as ContentBlock;
  return base as ContentBlock;
}
