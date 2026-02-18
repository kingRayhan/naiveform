import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@repo/convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { Button } from "@repo/design-system/button";
import type { Doc } from "@repo/convex/dataModel";

export const Route = createFileRoute("/forms/$formId/responses")({
  component: FormResponsesPage,
});

function escapeCsvCell(val: string): string {
  if (/[",\n\r]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
  return val;
}

function formatAnswerForCsv(value: string | string[] | number | undefined): string {
  if (value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "number") {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return String(value);
}

function formatAnswer(value: string | string[] | number | undefined): string {
  return formatAnswerForCsv(value);
}

function FormResponsesPage() {
  const { formId } = useParams({ from: "/forms/$formId/responses" });
  const formIdTyped = formId as Id<"forms">;
  const form = useQuery(api.forms.get, { formId: formIdTyped });
  const responses = useQuery(api.responses.listByForm, { formId: formIdTyped });

  if (form === undefined || responses === undefined) {
    return (
      <div className="text-muted-foreground">Loading responses…</div>
    );
  }
  if (form === null) {
    return <div className="text-destructive">Form not found.</div>;
  }

  const questions = form.questions;

  const exportCsv = () => {
    const headers = ["Submitted", ...questions.map((q) => q.title || "(Untitled)")];
    const rows = responses.map((r: Doc<"responses">) => [
      new Date(r._creationTime).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      }),
      ...questions.map((q) => formatAnswerForCsv(r.answers[q.id])),
    ]);
    const csvContent = [
      headers.map(escapeCsvCell).join(","),
      ...rows.map((row) => row.map(escapeCsvCell).join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Responses</h2>
          <p className="text-muted-foreground text-sm">
            {responses.length} {responses.length === 1 ? "response" : "responses"}
          </p>
        </div>
        {responses.length > 0 && (
          <Button variant="outline" size="sm" onClick={exportCsv}>
            Export CSV
          </Button>
        )}
      </div>

      {responses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          No responses yet. Share your form to start collecting.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Submitted
                </th>
                {questions.map((q) => (
                  <th
                    key={q.id}
                    className="px-4 py-3 text-left font-medium text-foreground"
                  >
                    {q.title || "(Untitled)"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r._creationTime).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  {questions.map((q) => (
                    <td key={q.id} className="px-4 py-3 text-foreground max-w-[200px] truncate" title={formatAnswer(r.answers[q.id])}>
                      {formatAnswer(r.answers[q.id])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
