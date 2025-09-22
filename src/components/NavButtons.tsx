"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home, Bot, History } from "lucide-react";

export default function NavButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAIAssistant = pathname === "/asistente-ia";
  
  return (
    <>
      {/* Mobile-first navigation */}
      <div className="flex items-center justify-between">
        {/* Left side - KONTADOR brand */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <span className="font-black text-xl text-gray-900 tracking-tighter" style={{ fontStretch: 'condensed' }}>KONTADOR</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          {!isHome && (
            <Link 
              href="/" 
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home size={16} />
              Inicio
            </Link>
          )}
          {!isAIAssistant && (
            <Link 
              href="/asistente-ia" 
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Bot size={16} />
              ContadorIA
            </Link>
          )}
          <Link 
            href="/historial-conversaciones" 
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
          >
            <History size={16} />
            Historial
          </Link>
        </div>

      </div>
    </>
  );
}