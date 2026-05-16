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

import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: "Trust Chain AI",
  description: "Autonomous Multi-Agent Cybersecurity Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey="pk_test_dXNhYmxlLWRyYWdvbi05Mi5jbGVyay5hY2NvdW50cy5kZXYk" appearance={{ variables: { colorPrimary: '#3b82f6', colorBackground: '#0a0a0a', colorText: 'white', colorInputBackground: '#111' } }}>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
      </html>
    </ClerkProvider>
  );
}
