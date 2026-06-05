import type { Metadata } from "next";
import "./globals.css";

import { fraunces } from "@/fonts/fraunces";

import { AuthProvider } from "./auth-context";
import { ThemeProvider } from "./providers";

export const metadata: Metadata = {
  title: "Hubb - Community Management Platform",
  description: "Simple admin dashboard for community organizations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fraunces.variable}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
