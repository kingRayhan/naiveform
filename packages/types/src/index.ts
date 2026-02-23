import type { ZodError } from "zod";

/**
 * POST /f/:formId – success response (200)
 */
export type SubmitFormSuccess = {
  message: string;
  responseId: string;
};

/**
 * POST /f/:formId – error response (4xx, 5xx)
 */
export type SubmitFormError = {
  error: string;
};

/**
 * POST /f/:formId – validation error response (400)
 */
export type SubmitFormValidationError = {
  errors: ZodError["issues"];
};

// Block model (form builder + form filler)
export type {
  BlockKind,
  BaseBlock,
  CommonInputBlock,
  TextBlock,
  EmailBlock,
  PhoneBlock,
  UrlBlock,
  LongTextBlock,
  RadioInputBlock,
  CheckboxesBlock,
  DropdownBlock,
  DateBlock,
  TimeBlock,
  DateTimeBlock,
  NumberBlock,
  StarRatingBlock,
  LinearScaleBlock,
  YesNoBlock,
  InputBlock,
  ContentBlockBase,
  HeadingBlock,
  ParagraphBlock,
  ImageBlock,
  YouTubeEmbedBlock,
  DividerBlock,
  ContentBlock,
  FormBlock,
  AnswerValue,
  FormResponse,
} from "./blocks";
export {
  isInputBlock,
  isContentBlock,
  getFormBlocks,
  INPUT_BLOCK_TYPES,
  CONTENT_BLOCK_TYPES,
  createEmptyInputBlock,
  createEmptyContentBlock,
} from "./blocks";
