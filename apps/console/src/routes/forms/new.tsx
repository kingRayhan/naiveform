import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@repo/design-system/button";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "@repo/convex/react";
import { api } from "@repo/convex";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "@repo/design-system/form/form-input";
import { FormTextarea } from "@repo/design-system/form/form-textarea";

const newFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type NewFormValues = z.infer<typeof newFormSchema>;

export const Route = createFileRoute("/forms/new")({
  component: NewFormPage,
});

function NewFormPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const createForm = useMutation(api.forms.create);

  const form = useForm<NewFormValues>({
    resolver: zodResolver(newFormSchema),
    defaultValues: { title: "", description: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  const onSubmit = async (data: NewFormValues) => {
    if (!user?.id) {
      setError("root", { message: "You must be signed in to create a form." });
      return;
    }
    try {
      const formId = await createForm({
        title: data.title.trim() || "Untitled form",
        description: data.description?.trim() || undefined,
        userId: user.id,
      });
      navigate({ to: "/forms/$formId", params: { formId } });
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to create form",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Create a new form</h1>
      <p className="mt-1 text-muted-foreground">
        Give your form a title and optional description.
      </p>
      <form
        id="new-form"
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4"
      >
        <FormInput
          name="title"
          control={form.control}
          label="Form title"
          placeholder="Untitled form"
        />
        <FormTextarea
          name="description"
          control={form.control}
          label="Description (optional)"
          placeholder="Add a short description for respondents"
          rows={3}
        />
        {form.formState.errors.root && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.root.message}
          </p>
        )}
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create form"}
          </Button>
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isSubmitting}
          >
            <Link to="/">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
