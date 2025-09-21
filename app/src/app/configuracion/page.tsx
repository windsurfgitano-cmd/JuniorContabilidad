export const dynamic = "force-dynamic";

import Link from "next/link";

export default function Configuracion() {
  return (
    <div className="min-h-screen p-6 sm:p-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <nav className="flex gap-3 text-sm">
          <Link href="/" className="underline">Dashboard</Link>
          <Link href="/clientes" className="underline">Clientes</Link>
          <Link href="/tareas" className="underline">Tareas</Link>
          <Link href="/obligaciones" className="underline">Obligaciones</Link>
          <Link href="/auditorias" className="underline">Auditorías</Link>
          <Link href="/calendario" className="underline">Calendario</Link>
        </nav>
      </header>

      <main className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border p-5 lg:col-span-2">
          <h2 className="font-medium mb-2">Preferencias generales</h2>
          <p className="text-sm text-muted-foreground">
            Esta es la página base de configuración. Próximamente podrás ajustar recordatorios por defecto, estados de trabajo y preferencias de visualización.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="rounded border p-4">
              <h3 className="font-medium text-sm mb-2">Recordatorios</h3>
              <p className="text-xs text-muted-foreground">Define días de antelación para notificar vencimientos.</p>
              <div className="mt-3 flex items-center gap-2">
                <label htmlFor="diasAntelacion" className="text-sm">Días por defecto</label>
                <input id="diasAntelacion" type="number" min={0} defaultValue={3} className="border rounded px-2 py-1 w-24" disabled />
              </div>
            </div>
            <div className="rounded border p-4">
              <h3 className="font-medium text-sm mb-2">Estados de tareas</h3>
              <p className="text-xs text-muted-foreground">Pendiente, En proceso, Bloqueado, Completado.</p>
              <div className="mt-3 text-xs text-muted-foreground">Próximamente podrás personalizarlos.</div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="font-medium mb-2">Atajos</h2>
          <ul className="text-sm list-disc pl-4 space-y-1">
            <li><Link href="/tareas" className="underline">Ir a Tareas</Link></li>
            <li><Link href="/obligaciones" className="underline">Ir a Obligaciones</Link></li>
            <li><Link href="/auditorias" className="underline">Ir a Auditorías</Link></li>
          </ul>
        </section>
      </main>
    </div>
  );
}