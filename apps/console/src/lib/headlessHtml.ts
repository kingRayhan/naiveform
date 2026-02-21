import type { FormQuestion } from "./form-builder-types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build the headless HTML snippet: script, form with data-form-wrapper, data-loading, data-form-error, data-form-submitted. */
export function buildHeadlessHtml(
  questions: FormQuestion[],
  actionUrl: string
): string {
  const scriptBase =
    actionUrl.indexOf("/") > 0
      ? actionUrl.replace(/\/html-action\/.*$/, "")
      : actionUrl;
  const attr = (name: string, value: string) =>
    value ? ` ${name}="${value.replace(/"/g, "&quot;")}"` : "";
  const lines: string[] = [
    `<script src="${scriptBase}/form.js"></script>`,
    "",
    `<form action="${actionUrl}" method="post">`,
    `  <div data-form-wrapper>`,
  ];
  for (const q of questions) {
    const title = q.title || "Untitled";
    const id = `q-${q.id}`;
    const name = escapeHtml(q.id);
    const req = q.required ? " required" : "";
    if (q.type === "short_text") {
      const type =
        q.inputType === "email"
          ? "email"
          : q.inputType === "number"
            ? "number"
            : "text";
      const placeholder =
        q.inputType === "email"
          ? "you@example.com"
          : q.inputType === "phone"
            ? "+1 (555) 000-0000"
            : "Your answer";
      lines.push(
        `    <label for="${id}">${escapeHtml(title)}${q.required ? " *" : ""}</label>`
      );
      lines.push(
        `    <input name="${name}" id="${id}" type="${type}"${attr("placeholder", placeholder)}${req}>`
      );
    } else if (q.type === "long_text") {
      lines.push(
        `    <label for="${id}">${escapeHtml(title)}${q.required ? " *" : ""}</label>`
      );
      lines.push(
        `    <textarea name="${name}" id="${id}" rows="3"${req}></textarea>`
      );
    } else if (q.type === "multiple_choice") {
      lines.push(`    <fieldset>`);
      lines.push(
        `      <legend>${escapeHtml(title)}${q.required ? " *" : ""}</legend>`
      );
      for (const opt of q.options ?? []) {
        const v = opt || "Option";
        lines.push(
          `      <label><input type="radio" name="${name}" value="${escapeHtml(v)}"${req}> ${escapeHtml(v)}</label>`
        );
      }
      lines.push(`    </fieldset>`);
    } else if (q.type === "checkboxes") {
      lines.push(`    <fieldset>`);
      lines.push(
        `      <legend>${escapeHtml(title)}${q.required ? " *" : ""}</legend>`
      );
      for (const opt of q.options ?? []) {
        const v = opt || "Option";
        lines.push(
          `      <label><input type="checkbox" name="${name}" value="${escapeHtml(v)}"> ${escapeHtml(v)}</label>`
        );
      }
      lines.push(`    </fieldset>`);
    } else if (q.type === "dropdown") {
      lines.push(
        `    <label for="${id}">${escapeHtml(title)}${q.required ? " *" : ""}</label>`
      );
      lines.push(`    <select name="${name}" id="${id}"${req}>`);
      lines.push(`      <option value="">Choose</option>`);
      for (const opt of q.options ?? []) {
        lines.push(
          `      <option value="${escapeHtml(opt || "Option")}">${escapeHtml(opt || "Option")}</option>`
        );
      }
      lines.push(`    </select>`);
    } else if (q.type === "date") {
      lines.push(
        `    <label for="${id}">${escapeHtml(title)}${q.required ? " *" : ""}</label>`
      );
      lines.push(`    <input name="${name}" id="${id}" type="date"${req}>`);
    } else if (q.type === "star_rating") {
      const max = Math.min(10, Math.max(1, q.ratingMax ?? 5));
      lines.push(
        `    <label for="${id}">${escapeHtml(title)}${q.required ? " *" : ""}</label>`
      );
      lines.push(
        `    <input name="${name}" id="${id}" type="number" min="1" max="${max}"${req}>`
      );
    }
  }
  lines.push(`    <button type="submit">Submit</button>`);
  lines.push(`  </div>`);
  lines.push(`  <div data-loading style="display:none">loading...</div>`);
  lines.push(`  <div data-form-error style="display:none"></div>`);
  lines.push(
    `  <div data-form-submitted style="display:none">form-submitted</div>`
  );
  lines.push(`</form>`);
  return lines.join("\n");
}
