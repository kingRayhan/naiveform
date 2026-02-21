import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@repo/convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { ExternalLink } from "lucide-react";
import { FormEditor } from "../../../components/form-builder/FormEditor";
import { FormPreview } from "../../../components/form-builder/FormPreview";
import { useFormBuilder } from "@/components/form-builder/form-builder-context";
import { Button } from "@repo/design-system/button";
import type { FormQuestion } from "@/lib/form-builder-types";
import { buildHeadlessHtml } from "@/lib/headlessHtml";

const FORM_APP_URL = import.meta.env.VITE_FORM_APP_URL ?? "";
const HEADLESS_FORM_ACTION_URL = (
  import.meta.env.VITE_HEADLESS_FORM_ACTION_URL ?? ""
).replace(/\/$/, "");

/** Sample value for a question (for curl example). */
function sampleValue(q: FormQuestion): string {
  switch (q.type) {
    case "short_text":
      return q.inputType === "email" ? "you@example.com" : "Your answer";
    case "long_text":
      return "Your answer";
    case "multiple_choice":
    case "dropdown":
      return (q.options?.[0] as string) ?? "Option";
    case "checkboxes":
      return (q.options?.[0] as string) ?? "Option";
    case "date":
      return new Date().toISOString().slice(0, 10);
    case "star_rating":
      return "5";
    default:
      return "Your answer";
  }
}

function buildApiCurl(formId: string, questions: FormQuestion[], baseUrl: string): string {
  const url = `${baseUrl}/form-submission/${formId}`;
  const values: Record<string, string> = {};
  for (const q of questions) {
    values[q.id] = sampleValue(q);
  }
  const body = JSON.stringify({ values }, null, 2);
  const escaped = body.replace(/'/g, "'\\''");
  return `curl --request POST \\
  --url ${url} \\
  --header 'content-type: application/json' \\
  --data '${escaped}'`;
}

export const Route = createFileRoute("/forms/$formId/")({
  component: FormEditorPage,
});

function formatLastSaved(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  return isToday
    ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function FormEditorPage() {
  const { formId } = useParams({ from: "/forms/$formId/" });
  const formIdTyped = formId as Id<"forms">;
  const form = useQuery(api.forms.get, { formId: formIdTyped });
  const { questions, saveForm } = useFormBuilder();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [previewTab, setPreviewTab] = useState<
    "preview" | "headless" | "api"
  >("preview");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveForm();
      setLastSavedAt(Date.now());
    } finally {
      setIsSaving(false);
    }
  };

  const savedAt = lastSavedAt ?? form?.updatedAt;
  const formIdOrSlug = form?.slug?.trim() || formId;
  const headlessActionUrl = HEADLESS_FORM_ACTION_URL
    ? `${HEADLESS_FORM_ACTION_URL}/html-action/${form?._id as Id<"forms">}`
    : "";
  const headlessHtml = headlessActionUrl
    ? buildHeadlessHtml(questions, headlessActionUrl)
    : "";
  const apiCurl =
    HEADLESS_FORM_ACTION_URL && form?._id && questions.length > 0
      ? buildApiCurl(form._id as string, questions, HEADLESS_FORM_ACTION_URL)
      : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Editor</h2>
            <p className="text-muted-foreground text-sm">
              Drag the handle to reorder. Edit title and options inline.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {savedAt != null && (
              <span className="text-xs text-muted-foreground">
                Last saved at {formatLastSaved(savedAt)}
              </span>
            )}
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
        <FormEditor />
      </div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-semibold text-foreground">Preview</h2>
          {FORM_APP_URL && (
            <a
              href={`${FORM_APP_URL.replace(/\/$/, "")}/${formIdOrSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Open form
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setPreviewTab("preview")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              previewTab === "preview"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("headless")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              previewTab === "headless"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Headless HTML
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("api")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              previewTab === "api"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            API
          </button>
        </div>
        {previewTab === "preview" && (
          <>
            <p className="text-muted-foreground text-sm mb-4">
              How respondents will see the form.
            </p>
            <FormPreview
              questions={questions}
              formTitle={form?.title ?? "Untitled form"}
              formDescription={form?.description}
            />
          </>
        )}
        {previewTab === "api" && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {!HEADLESS_FORM_ACTION_URL ? (
              <p className="p-4 text-sm text-muted-foreground">
                Set{" "}
                <code className="bg-muted px-1 rounded">
                  VITE_HEADLESS_FORM_ACTION_URL
                </code>{" "}
                in .env to your API base URL to see the cURL example.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-muted/50">
                  <span className="text-xs font-medium text-foreground">
                    cURL – POST JSON to submit the form
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      apiCurl && navigator.clipboard?.writeText(apiCurl)
                    }
                    disabled={!apiCurl}
                  >
                    Copy
                  </Button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs text-foreground font-mono bg-muted/30 max-h-[480px] overflow-y-auto whitespace-pre">
                  <code>{apiCurl || "Add questions to see the cURL example."}</code>
                </pre>
              </>
            )}
          </div>
        )}
        {previewTab === "headless" && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {!HEADLESS_FORM_ACTION_URL ? (
              <p className="p-4 text-sm text-muted-foreground">
                Set{" "}
                <code className="bg-muted px-1 rounded">
                  VITE_HEADLESS_FORM_ACTION_URL
                </code>{" "}
                in .env to your API base URL (e.g.{" "}
                <code className="bg-muted px-1 rounded">
                  https://api.naiveform.com
                </code>
                ). Form action:{" "}
                <code className="bg-muted px-1 rounded">
                  {"{base}"}/html-action/{"{formId}"}
                </code>
                .
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-muted/50">
                  <span className="text-xs font-medium text-foreground">
                    HTML (copy & paste) - Go with your own styles.
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      headlessHtml &&
                      navigator.clipboard?.writeText(headlessHtml)
                    }
                    disabled={!headlessHtml}
                  >
                    Copy
                  </Button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs text-foreground font-mono bg-muted/30 max-h-[480px] overflow-y-auto">
                  <code>
                    {headlessHtml ||
                      "Add questions and set VITE_HEADLESS_FORM_ACTION_URL to see HTML."}
                  </code>
                </pre>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
