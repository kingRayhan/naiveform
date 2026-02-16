import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Account settings</h1>
      <p className="mt-1 text-muted-foreground mb-6">
        Profile and app preferences. Sign-in is managed by Clerk.
      </p>
      <div className="p-6 border border-dashed border-border rounded-lg text-center text-muted-foreground">
        Settings form coming soon.
      </div>
    </div>
  );
}
