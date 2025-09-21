"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function NavButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <div className="mb-4 flex items-center gap-2">
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
    </div>
  );
}