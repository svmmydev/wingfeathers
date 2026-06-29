import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/AppHeader";
import "./globals.css";
import { AppFooter } from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "WingFeathers",
  description: "Galería ornitológica de Rafael Mateos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <AppHeader />

        <main className="min-h-screen bg-(--color-background-body) text-(--color-text)">
          {children}
        </main>

        <AppFooter />
      </body>
    </html>
  );
}
