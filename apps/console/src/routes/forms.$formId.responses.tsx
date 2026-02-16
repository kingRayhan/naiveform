import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/$formId/responses")({
  component: FormResponsesPage,
});

function FormResponsesPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Responses</h2>
      <p className="text-muted-foreground mb-4">
        List and summary of submissions. Export to CSV/Excel.
      </p>
      <div className="p-6 border border-dashed border-border rounded-lg text-center text-muted-foreground">
        Responses table and summary charts coming soon.
      </div>
    </div>
  );
}
