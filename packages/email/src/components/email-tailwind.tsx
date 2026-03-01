import { Tailwind } from "@react-email/tailwind";
import type { ReactNode } from "react";

const emailTailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: "#ce582e",
        "gray-email": "#333",
        "gray-muted": "#898989",
      },
    },
  },
} as const;

interface EmailTailwindProviderProps {
  children: ReactNode;
}

export function EmailTailwindProvider({
  children,
}: EmailTailwindProviderProps) {
  return <Tailwind config={emailTailwindConfig}>{children}</Tailwind>;
}
