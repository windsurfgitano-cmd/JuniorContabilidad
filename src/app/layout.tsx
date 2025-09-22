import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/app/globals.css";
import { ReactNode } from "react";
import NavButtons from "@/components/NavButtons";
import GlobalAISidebar from "@/components/GlobalAISidebar";
import MobileNavigation from "@/components/MobileNavigation";
import { PageProvider } from "@/contexts/PageContext";
import { MobileNavigationProvider } from "@/contexts/MobileNavigationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KONTADOR - Gestión Contable Inteligente",
  description: "Plataforma integral para la gestión contable de empresas. Automatiza obligaciones fiscales, gestiona tareas y mantén el control total de tu contabilidad.",
  keywords: ["contabilidad", "gestión fiscal", "obligaciones tributarias", "automatización contable", "software contable"],
  authors: [{ name: "KONTADOR" }],
  openGraph: {
    title: "KONTADOR - Gestión Contable Inteligente",
    description: "Plataforma integral para la gestión contable de empresas. Automatiza obligaciones fiscales, gestiona tareas y mantén el control total de tu contabilidad.",
    type: "website",
    locale: "es_ES",
    siteName: "KONTADOR",
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <PageProvider>
          <MobileNavigationProvider>
          {/* Mobile-first layout */}
          <div className="min-h-screen flex flex-col">
            {/* Header - Mobile optimized */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
              <div className="px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between">
                {/* Logo KONTADOR a la izquierda */}
                <h1 className="text-xl font-black text-gray-900 tracking-tighter" style={{ fontStretch: 'condensed' }}>
                  KONTADOR
                </h1>
                
                {/* Navegación en el centro/derecha */}
                <div className="flex items-center space-x-4">
                  <div className="hidden lg:block">
                    <NavButtons />
                  </div>
                  {/* Botón de hamburguesa a la derecha (solo móvil) */}
                   <div className="lg:hidden">
                     <MobileNavigation buttonOnly={true} />
                   </div>
                </div>
              </div>
            </header>

            {/* Main content - Mobile optimized */}
            <main className="flex-1 overflow-hidden">
              <div className="h-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
                {children}
              </div>
            </main>
          </div>
          
          {/* Mobile Navigation Menu */}
          <MobileNavigation />
          
          {/* AI Sidebar - Mobile optimized */}
          <GlobalAISidebar />
          </MobileNavigationProvider>
        </PageProvider>
      </body>
    </html>
  );
}
