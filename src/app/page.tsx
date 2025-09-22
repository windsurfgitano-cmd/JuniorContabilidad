export const dynamic = "force-dynamic";

import { PrismaClient } from "@/generated/prisma";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function Home() {
  const hoy = new Date();
  const en7dias = new Date();
  en7dias.setDate(hoy.getDate() + 7);

  const [
    clientesCount,
    pendientes,
    enProceso,
    bloqueadas,
    completadas,
    obligacionesProximas,
  ] = await Promise.all([
    prisma.cliente.count(),
    prisma.tarea.count({ where: { estado: "PENDIENTE" } }),
    prisma.tarea.count({ where: { estado: "EN_PROCESO" } }),
    prisma.tarea.count({ where: { estado: "BLOQUEADO" } }),
    prisma.tarea.count({ where: { estado: "COMPLETADO" } }),
    prisma.obligacionFiscal.findMany({
      where: { fechaLimite: { gte: hoy, lte: en7dias } },
      include: { cliente: true },
      orderBy: { fechaLimite: "asc" },
      take: 5,
    }),
  ]);

  const totalTareas = pendientes + enProceso + bloqueadas + completadas;

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Agenda para Contadores y Auditores</h1>
        <nav className="flex gap-3 text-sm">
          <Link href="/clientes" className="underline">Clientes</Link>
          <Link href="/tareas" className="underline">Tareas</Link>
          <Link href="/obligaciones" className="underline">Obligaciones</Link>
          <Link href="/auditorias" className="underline">Auditorías</Link>
          <Link href="/calendario" className="underline">Calendario</Link>
          <Link href="/configuracion" className="underline">Configuración</Link>
        </nav>
      </header>

      <main className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border p-5 lg:col-span-2">
          <h2 className="font-medium mb-2">Resumen</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded border p-3">
              <p className="text-xs text-muted-foreground">Clientes</p>
              <p className="text-2xl font-semibold">{clientesCount}</p>
              <Link href="/clientes" className="underline text-xs">Ver clientes</Link>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-muted-foreground">Tareas</p>
              <p className="text-2xl font-semibold">{totalTareas}</p>
              <p className="text-xs text-muted-foreground mt-1">Pend.: {pendientes} · En proc.: {enProceso} · Blq.: {bloqueadas} · Comp.: {completadas}</p>
              <Link href="/tareas" className="underline text-xs">Ver tareas</Link>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-muted-foreground">Próximos 7 días</p>
              <p className="text-2xl font-semibold">{obligacionesProximas.length}</p>
              <Link href="/calendario" className="underline text-xs">Ver calendario</Link>
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="font-medium mb-2">Accesos rápidos</h2>
          <ul className="text-sm list-disc pl-4 space-y-1">
            <li><Link href="/clientes" className="underline">Registrar cliente</Link></li>
            <li><Link href="/tareas" className="underline">Nueva tarea</Link></li>
            <li><Link href="/obligaciones" className="underline">Nueva obligación fiscal</Link></li>
            <li><Link href="/auditorias" className="underline">Nueva auditoría</Link></li>
          </ul>
        </section>

        <section className="rounded-lg border p-5 lg:col-span-3">
          <h2 className="font-medium mb-2">Plazos fiscales en los próximos 7 días</h2>
          {obligacionesProximas.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay obligaciones próximas.</p>
          ) : (
            <ul className="space-y-2">
              {obligacionesProximas.map((o) => (
                <li key={o.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{o.tipo} — {o.periodo} · {o.cliente.nombre}</p>
                    <p className="text-sm text-muted-foreground">Vence: {new Date(o.fechaLimite).toLocaleDateString("es-CL")}</p>
                  </div>
                  <Link className="underline text-sm" href="/obligaciones">Ver</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
