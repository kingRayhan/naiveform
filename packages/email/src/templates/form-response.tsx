import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailFooter } from "../components/email-footer";
import { EmailTailwindProvider } from "../components/email-tailwind";

export interface FormResponseItem {
  label: string;
  value: string;
}

interface FormResponseProps {
  formTitle: string;
  responsesUrl: string;
  responses: FormResponseItem[];
  submittedAt?: string;
}

export const FormResponse = ({
  formTitle,
  responsesUrl,
  responses,
  submittedAt,
}: FormResponseProps) => (
  <Html>
    <Head />
    <Body className="bg-white">
      <Preview>New response for {formTitle}</Preview>
      <EmailTailwindProvider>
        <Container className="px-3 mx-auto font-sans">
          <Heading className="text-gray-email text-2xl font-bold my-10 p-0">
            New response
          </Heading>
          <Text className="text-gray-email my-6 mb-3.5">
            You received a new response for <strong>{formTitle}</strong>
            {submittedAt ? ` on ${submittedAt}.` : "."}
          </Text>
          <Section
            className="my-6 p-4 rounded-md"
            style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            {responses.map((item, index) => (
              <Section key={index} className="mb-4">
                <Text className="text-gray-muted text-xs font-medium m-0 mb-1">
                  {item.label}
                </Text>
                <Text className="text-gray-email text-sm m-0">
                  {item.value || "—"}
                </Text>
              </Section>
            ))}
          </Section>
          <Link
            href={responsesUrl}
            className="inline-block bg-brand text-white font-medium px-5 py-3 rounded-md no-underline mt-2"
          >
            View all responses
          </Link>
          <Text className="text-gray-email mt-6 mb-9 text-gray-muted text-sm">
            This notification was sent by Naiveform. You can manage form
            notifications in your account settings.
          </Text>
          <EmailFooter />
        </Container>
      </EmailTailwindProvider>
    </Body>
  </Html>
);

FormResponse.PreviewProps = {
  formTitle: "Contact us",
  responsesUrl: "https://console.naiveform.com/forms/abc123/responses",
  responses: [
    { label: "Name", value: "Jane Doe" },
    { label: "Email", value: "jane@example.com" },
    { label: "Message", value: "I'd like to learn more about your product." },
  ],
  submittedAt: "Feb 25, 2026 at 2:30 PM",
} as FormResponseProps;

export default FormResponse;
