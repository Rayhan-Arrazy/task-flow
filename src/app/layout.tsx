import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TaskFlow AI — Smart Task Management",
  description:
    "AI-powered task management platform. Create tasks and let AI automatically suggest priority levels. Stay organized, stay productive.",
  keywords: [
    "task management",
    "AI",
    "project management",
  ],
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
    <html lang="en" className={cn("font-sans antialiased", inter.variable)}>
      <body>
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
