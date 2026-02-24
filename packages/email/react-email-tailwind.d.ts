declare module "@react-email/tailwind" {
  import type { ComponentType } from "react";

  export interface TailwindConfig {
    theme?: {
      extend?: {
        colors?: Record<string, string>;
      };
    };
    presets?: unknown[];
  }

  export interface TailwindProps {
    config?: TailwindConfig;
    children: React.ReactNode;
  }

  export const Tailwind: ComponentType<TailwindProps>;
}
