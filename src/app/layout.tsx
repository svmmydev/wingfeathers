import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/AppHeader";
import "./globals.css";

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
    <html lang="es">
      <body>
        <AppHeader />

        <main className="min-h-screen bg-(--color-background) text-(--color-text)">
          {children}
        </main>
      </body>
    </html>
  );
}
