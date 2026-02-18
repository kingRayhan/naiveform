import { FormFiller } from "@/components/FormFiller";

type Props = {
  params: Promise<{ formId: string }>;
};

export default async function EmbedFormPage({ params }: Props) {
  const { formId } = await params;
  return (
    <div className="min-h-[100dvh] bg-background py-6 px-4" data-embed>
      <FormFiller formIdOrSlug={formId} />
    </div>
  );
}
