import type { Metadata } from "next";
import { Cinzel, Geist_Mono } from "next/font/google";
import "./globals.css";

// Fonte para títulos medievais
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Mantemos a mono para elementos de sistema (opcional)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chronicles: RPG TERMINAL",
  description: "Seu Terminal Digital de Aventuras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${cinzel.variable} ${geistMono.variable} antialiased font-serif bg-stone-950 text-stone-300`}>
        {children}
      </body>
    </html>
  );
}