import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@repo/design-system/button";
import { useState } from "react";

export const Route = createFileRoute("/forms/new")({
  component: NewFormPage,
});

function NewFormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API to create form, then navigate to editor
    const mockId = "new-form-id";
    navigate({ to: "/forms/$formId", params: { formId: mockId } });
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Create a new form</h1>
      <p className="mt-1 text-muted-foreground">
        Give your form a title and optional description.
      </p>
      <form onSubmit={handleCreate} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
            Form title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled form"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a short description for respondents"
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Create form</Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
