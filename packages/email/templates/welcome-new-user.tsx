import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import { EmailFooter } from "../components/email-footer";
import { EmailTailwindProvider } from "../components/email-tailwind";
import { CONSOLE_APP_NEW_FORM_URL } from "../config";

interface WelcomeNewUserProps {
  userName: string;
}

export const WelcomeNewUser = ({ userName }: WelcomeNewUserProps) => (
  <Html>
    <Head />
    <Body className="bg-white">
      <Preview>Welcome to Naiveform, {userName}!</Preview>
      <EmailTailwindProvider>
        <Container className="px-3 mx-auto font-sans">
          <Heading className="text-gray-email text-2xl font-bold my-10 p-0">
            Welcome, {userName} 👋
          </Heading>
          <Text className="text-gray-email my-6 mb-3.5">
            Thanks for signing up for Naiveform. We&apos;re excited to have you
            on board.
          </Text>
          <Text className="text-gray-email my-6 mb-3.5">
            You can start creating forms right away and share them with your
            team in just a few clicks.
          </Text>
          <Link
            href={CONSOLE_APP_NEW_FORM_URL}
            className="inline-block bg-brand text-white font-medium px-5 py-3 rounded-md no-underline mt-2"
          >
            Create your first form
          </Link>
          <Text className="text-gray-email mt-6 mb-9 text-gray-muted">
            If you have any questions, just reply to this email — we&apos;re
            here to help.
          </Text>
          <EmailFooter />
        </Container>
      </EmailTailwindProvider>
    </Body>
  </Html>
);

WelcomeNewUser.PreviewProps = {
  userName: "Alex",
  appName: "Naiveform",
} as WelcomeNewUserProps;

export default WelcomeNewUser;
