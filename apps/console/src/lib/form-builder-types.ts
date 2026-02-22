/**
 * Re-export block model and helpers from @repo/types.
 * Use FormBlock, InputBlock, ContentBlock, etc. from @repo/types in the editor.
 */
export {
  INPUT_BLOCK_TYPES,
  CONTENT_BLOCK_TYPES,
  createEmptyInputBlock,
  createEmptyContentBlock,
  isInputBlock,
  isContentBlock,
  getFormBlocks,
} from "@repo/types";
export type {
  FormBlock,
  InputBlock,
  ContentBlock,
} from "@repo/types";

/** Slug from title for block id: lowercase, alphanumeric + underscores. */
export function slugify(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return s || "field";
}

/** Return a slug unique among existingIds (append -2, -3 if needed). */
export function uniqueSlug(title: string, existingIds: string[]): string {
  const base = slugify(title);
  const set = new Set(existingIds);
  if (!set.has(base)) return base;
  let n = 2;
  while (set.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
