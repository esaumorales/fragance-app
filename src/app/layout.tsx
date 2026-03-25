import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Lyon Call | Perfumería Exclusiva",
  description: "Encuentra tu aroma ideal. Perfumes exclusivos para resaltar tu estilo y presencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-zinc-100 font-sans selection:bg-primary selection:text-background">
        {children}
      </body>
    </html>
  );
}
