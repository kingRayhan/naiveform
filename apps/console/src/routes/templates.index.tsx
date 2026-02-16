import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@repo/design-system/button";

export const Route = createFileRoute("/templates/")({
  component: TemplatesPage,
});

const MOCK_TEMPLATES = [
  { id: "feedback", name: "Feedback", description: "Collect feedback or reviews" },
  { id: "registration", name: "Event registration", description: "Sign up for events" },
  { id: "quiz", name: "Quiz", description: "Multiple choice quiz" },
];

function TemplatesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Templates</h1>
      <p className="mt-1 text-muted-foreground mb-6">
        Start from a template or create a blank form.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_TEMPLATES.map((t) => (
          <div
            key={t.id}
            className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
          >
            <h3 className="font-medium text-foreground">{t.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/forms/new">Use template</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
