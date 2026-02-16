import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/$formId/settings")({
  component: FormSettingsPage,
});

function FormSettingsPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Form settings</h2>
      <p className="text-muted-foreground mb-4">
        Form-level options: collect emails, limit one response per person, confirmation message, close form date.
      </p>
      <div className="p-6 border border-dashed border-border rounded-lg text-center text-muted-foreground">
        Settings form coming soon.
      </div>
    </div>
  );
}
