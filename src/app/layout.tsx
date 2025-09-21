import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/app/globals.css";
import { ReactNode } from "react";
import NavButtons from "@/components/NavButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuContable - Gestión Contable Inteligente",
  description: "Plataforma integral para la gestión contable de empresas. Automatiza obligaciones fiscales, gestiona tareas y mantén el control total de tu contabilidad.",
  keywords: ["contabilidad", "gestión fiscal", "obligaciones tributarias", "automatización contable", "software contable"],
  authors: [{ name: "TuContable" }],
  openGraph: {
    title: "TuContable - Gestión Contable Inteligente",
    description: "Plataforma integral para la gestión contable de empresas. Automatiza obligaciones fiscales, gestiona tareas y mantén el control total de tu contabilidad.",
    type: "website",
    locale: "es_ES",
    siteName: "TuContable",
    images: [
      {
        url: "/api/og-image",
        width: 1200,
        height: 630,
        alt: "TuContable - Gestión Contable Inteligente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TuContable - Gestión Contable Inteligente",
    description: "Plataforma integral para la gestión contable de empresas. Automatiza obligaciones fiscales, gestiona tareas y mantén el control total de tu contabilidad.",
    images: ["/api/og-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="p-6">
          <NavButtons />
          {children}
          <footer className="mt-8 border-t pt-4 text-xs opacity-80">
            <p>Cuando yo hola yo chao asistentes contables.</p>
            <p>siii a todoo</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
