// --------------------
// Base
// --------------------

type BlockKind = "input" | "content";

interface BaseBlock {
  id: string;
  kind: BlockKind;
  type: string;
}

// --------------------
// Input blocks
// --------------------

interface CommonInputBlock extends BaseBlock {
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
interface TextBlock extends CommonInputBlock {
  type: "text";
  settings?: CommonInputBlock["settings"] & {
    minLength?: number;
    maxLength?: number;
  };
}

/** Email address. */
interface EmailBlock extends CommonInputBlock {
  type: "email";
  settings?: CommonInputBlock["settings"] & {
    minLength?: number;
    maxLength?: number;
  };
}

/** Phone number. */
interface PhoneBlock extends CommonInputBlock {
  type: "phone";
  settings?: CommonInputBlock["settings"];
}

/** URL. */
interface UrlBlock extends CommonInputBlock {
  type: "url";
  settings?: CommonInputBlock["settings"] & {
    minLength?: number;
    maxLength?: number;
  };
}

/** Paragraph: multi-line text. */
interface LongTextBlock extends CommonInputBlock {
  type: "long_text";
  settings?: CommonInputBlock["settings"] & {
    rows?: number;
    minLength?: number;
    maxLength?: number;
  };
}

/** Single choice from a list — rendered as radio buttons. */
interface RadioInputBlock extends CommonInputBlock {
  type: "radio";
  options: string[];
}

/** Multiple choices from a list (checkboxes). */
interface CheckboxesBlock extends CommonInputBlock {
  type: "checkbox";
  options: string[];
  settings?: CommonInputBlock["settings"] & {
    allowOther?: boolean;
    minSelections?: number;
    maxSelections?: number;
  };
}

/** Single choice from a dropdown. */
interface DropdownBlock extends CommonInputBlock {
  type: "dropdown";
  options: string[];
}

/** Date picker. */
interface DateBlock extends CommonInputBlock {
  type: "date";
  settings?: CommonInputBlock["settings"] & {
    minDate?: string; // ISO date
    maxDate?: string;
  };
}

/** Time of day. */
interface TimeBlock extends CommonInputBlock {
  type: "time";
}

/** Date and time. */
interface DateTimeBlock extends CommonInputBlock {
  type: "datetime";
  settings?: CommonInputBlock["settings"] & {
    minDate?: string;
    maxDate?: string;
  };
}

/** Numeric value with optional min/max/step. */
interface NumberBlock extends CommonInputBlock {
  type: "number";
  settings?: CommonInputBlock["settings"] & {
    min?: number;
    max?: number;
    step?: number;
  };
}

/** Star rating (e.g. 1–5). */
interface StarRatingBlock extends CommonInputBlock {
  type: "star_rating";
  settings?: CommonInputBlock["settings"] & {
    ratingMax?: number; // default 5
  };
}

/** Linear scale (e.g. 1–5 or 0–10, NPS-style). */
interface LinearScaleBlock extends CommonInputBlock {
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
interface YesNoBlock extends CommonInputBlock {
  type: "yes_no";
  settings?: CommonInputBlock["settings"];
}

type InputBlock =
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

interface ContentBlockBase extends BaseBlock {
  kind: "content";
}

interface HeadingBlock extends ContentBlockBase {
  type: "heading";
  text: string;
  settings?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

interface ParagraphBlock extends ContentBlockBase {
  type: "paragraph";
  content: string;
  settings?: {
    align?: "left" | "center" | "right";
    fontSize?: "small" | "medium" | "large";
  };
}

interface ImageBlock extends ContentBlockBase {
  type: "image";
  imageUrl: string;
  settings?: {
    alt?: string;
  };
}

interface YouTubeEmbedBlock extends ContentBlockBase {
  type: "youtube_embed";
  youtubeVideoId: string;
}

interface DividerBlock extends ContentBlockBase {
  type: "divider";
  settings?: {
    color?: "light" | "dark";
    thickness?: "thin" | "medium" | "thick";
  };
}

type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | YouTubeEmbedBlock
  | DividerBlock;

// --------------------
// Union & responses
// --------------------

type FormBlock = InputBlock | ContentBlock;

type AnswerValue = string | string[] | number;

interface FormResponse {
  formId: string;
  answers: Record<string, AnswerValue>; // key = input block id
}
