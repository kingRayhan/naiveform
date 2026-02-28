import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NaiveForm - Free Form Builder",
  description:
    "Create beautiful forms in minutes — free forever. Drag-and-drop builder, unlimited forms & responses, CSV export, webhooks, and API. No credit card required.",
  keywords: [
    "form builder",
    "free forms",
    "drag and drop",
    "survey",
    "google forms alternative",
  ],
  authors: [{ name: "NaiveForm Team" }],
  creator: "NaiveForm",
  publisher: "NaiveForm",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicons/favicon-apple-icon.png",
  },
  openGraph: {
    title: "NaiveForm - Free Form Builder",
    description: "Create beautiful forms in minutes — free forever.",
    url: "https://naiveform.com",
    siteName: "NaiveForm",

    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
