"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function NavButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAIAssistant = pathname === "/asistente-ia";
  
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border px-3 py-1 text-sm hover:bg-white hover:text-black"
        >
          ← Volver
        </button>
        {!isHome && (
          <Link href="/" className="rounded border px-3 py-1 text-sm hover:bg-white hover:text-black">
            Inicio
          </Link>
        )}
        {!isAIAssistant && (
          <Link 
            href="/asistente-ia" 
            className="rounded border px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
          >
            🤖 ContadorIA
          </Link>
        )}
        <Link 
          href="/historial-conversaciones" 
          className="rounded border px-3 py-1 text-sm bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1"
        >
          📚 Historial IA
        </Link>
      </div>
      
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image 
          src="/tucontable.png" 
          alt="TuContable" 
          width={40} 
          height={40}
          className="rounded-xl border-2 border-blue-200 shadow-sm h-auto"
        />
        <span className="font-semibold text-lg hidden sm:block">TuContable</span>
      </Link>
    </div>
  );
}