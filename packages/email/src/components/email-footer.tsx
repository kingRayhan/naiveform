import { Img, Link, Text } from "@react-email/components";
import { LANDING_APP_URL, LOGO_URL } from "../config";

interface EmailFooterProps {
  tagline?: string;
}

const DEFAULT_TAGLINE = "Build and share forms in minutes.";

export function EmailFooter({ tagline = DEFAULT_TAGLINE }: EmailFooterProps) {
  return (
    <>
      <Link href={LANDING_APP_URL}>
        <Img src={LOGO_URL} height={15} alt="Naiveform" className="mb-2" />
      </Link>
      <Text className="text-gray-muted text-xs leading-relaxed mt-3 mb-6">
        {tagline}
      </Text>
    </>
  );
}
