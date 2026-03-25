import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Aura | Perfumería Exclusiva",
  description: "Encuentra tu aroma ideal. Perfumes exclusivos para resaltar tu estilo y presencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-zinc-100 font-sans selection:bg-[#d4af37] selection:text-[#0f0f0f]">
        {children}
      </body>
    </html>
  );
}
