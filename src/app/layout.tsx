import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "TaskFlow AI — Smart Task Management",
  description:
    "AI-powered task management platform. Create tasks and let YandexGPT automatically suggest priority levels. Stay organized, stay productive.",
  keywords: ["task management", "AI", "productivity", "YandexGPT", "project management"],
  authors: [{ name: "TaskFlow AI" }],
  openGraph: {
    title: "TaskFlow AI — Smart Task Management",
    description:
      "AI-powered task management with automatic priority suggestions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
