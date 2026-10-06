import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/inline-script";
import { AppShell } from "@/components/layout/app-shell";
import { themeInitScript } from "@/lib/theme";
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
  title: {
    template: "%s · Interview Probe",
    default: "Interview Probe",
  },
  description: "Configure and run structured interview probes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The inline script sets data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={themeInitScript} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
