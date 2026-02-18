import { fetchQuery } from "convex/nextjs";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { FormFiller } from "@/components/FormFiller";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ formId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { formId } = await params;
  let form = await fetchQuery(api.forms.getBySlug, { slug: formId });
  if (!form) {
    try {
      form = await fetchQuery(api.forms.get, { formId: formId as Id<"forms"> });
    } catch {
      form = null;
    }
  }
  return {
    title: form?.title ?? "Naiveform",
    description:
      form?.description ??
      "Naiveform is a form builder that allows you to create forms in minutes.",
  };
}

export default async function FormPage({ params }: Props) {
  const { formId } = await params;
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <FormFiller formIdOrSlug={formId} />
    </div>
  );
}
