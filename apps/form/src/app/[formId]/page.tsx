import { FormFiller } from "@/components/FormFiller";

type Props = {
  params: Promise<{ formId: string }>;
};

export default async function FormPage({ params }: Props) {
  const { formId } = await params;
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <FormFiller formIdOrSlug={formId} />
    </div>
  );
}
