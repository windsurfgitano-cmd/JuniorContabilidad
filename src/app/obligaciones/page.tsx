export const dynamic = "force-dynamic";

import { PrismaClient } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

import { EstadoTarea, Prisma } from "@/generated/prisma";

const prisma = new PrismaClient();

export default async function ObligacionesPage({ searchParams }: { searchParams?: { vista?: string; estado?: string } }) {
  const hoy = new Date();
  const en7 = new Date();
  en7.setDate(hoy.getDate() + 7);
  const vista = (searchParams?.vista ?? "todas").toLowerCase();
  const estadoFiltro = (searchParams?.estado ?? "TODAS").toUpperCase();
  const where: any = {};
  if (vista === "proximas") {
    where.fechaLimite = { gte: hoy, lte: en7 };
  } else if (vista === "vencidas") {
    where.fechaLimite = { lt: hoy };
  }
  if (estadoFiltro !== "TODAS") {
    where.estado = estadoFiltro;
  }

  const obligaciones = await prisma.obligacionFiscal.findMany({
    where,
    orderBy: { fechaLimite: "asc" },
    include: { cliente: true },
  });

  const clientes = await prisma.cliente.findMany({ orderBy: { nombre: "asc" } });

  const formatDateInput = (d?: Date | null) => (d ? new Date(d).toISOString().split("T")[0] : "");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-semibold mb-4">Obligaciones Fiscales</h1>

      <section className="rounded-lg border p-4 mb-6">
        <h2 className="font-medium mb-3">Crear obligación</h2>
        <form action={crearObligacion} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select name="clienteId" required className="rounded border border-zinc-300 bg-white text-black px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
            <option value="">Selecciona cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <input name="tipo" placeholder="Tipo (IVA, Renta...)" required className="rounded border bg-transparent px-3 py-2" />
          <input name="periodo" placeholder="Periodo (2025-08, Q3...)" required className="rounded border bg-transparent px-3 py-2" />
          <input name="fechaLimite" type="date" required className="rounded border bg-transparent px-3 py-2" />
          <button type="submit" className="mt-1 rounded bg-white text-black px-3 py-2 text-sm font-medium sm:col-span-3">Guardar</button>
        </form>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="font-medium mb-3">Listado</h2>
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          {[
            { key: "todas", label: "Todas" },
            { key: "proximas", label: "Próximas (7d)" },
            { key: "vencidas", label: "Vencidas" },
          ].map((f) => (
            <a
              key={f.key}
              href={`/obligaciones${f.key === "todas" ? (estadoFiltro === "TODAS" ? "" : `?estado=${estadoFiltro}`) : `?vista=${f.key}${estadoFiltro === "TODAS" ? "" : `&estado=${estadoFiltro}`}`}`}
              className={`rounded-full border px-2 py-1 ${vista === f.key ? "bg-white text-black" : ""}`}
            >
              {f.label}
            </a>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          {[
            { key: "TODAS", label: "Todas" },
            { key: "PENDIENTE", label: "Pendientes" },
            { key: "EN_PROCESO", label: "En proceso" },
            { key: "BLOQUEADO", label: "Bloqueadas" },
            { key: "COMPLETADO", label: "Completadas" },
          ].map((f) => (
            <a
              key={f.key}
              href={`/obligaciones${vista === "todas" ? (f.key === "TODAS" ? "" : `?estado=${f.key}`) : `?vista=${vista}${f.key === "TODAS" ? "" : `&estado=${f.key}`}`}`}
              className={`rounded-full border px-2 py-1 ${estadoFiltro === f.key ? "bg-white text-black" : ""}`}
            >
              {f.label}
            </a>
          ))}
        </div>
        {obligaciones.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aún no hay obligaciones.</p>
        ) : (
          <ul className="space-y-2">
            {obligaciones.map((o) => (
              <li key={o.id} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{o.tipo} — {o.periodo}</p>
                    <p className="text-sm text-muted-foreground">{o.cliente.nombre} · Vence: {new Date(o.fechaLimite).toLocaleDateString("es-CL")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {new Date(o.fechaLimite) < hoy ? (
                      <span className="rounded-full border border-red-500 text-red-500 px-2 py-0.5 text-xs">Vencida</span>
                    ) : new Date(o.fechaLimite) <= en7 ? (
                      <span className="rounded-full border border-yellow-500 text-yellow-500 px-2 py-0.5 text-xs">Próxima</span>
                    ) : null}
                    <form action={actualizarEstadoObligacion} className="flex items-center gap-2 text-xs">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="estado" defaultValue={o.estado} className="rounded border border-zinc-300 bg-white text-black px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_PROCESO">En proceso</option>
                        <option value="BLOQUEADO">Bloqueada</option>
                        <option value="COMPLETADO">Completada</option>
                      </select>
                      <button type="submit" className="rounded border px-2 py-1">Actualizar</button>
                    </form>
                    <form action={eliminarObligacion}>
                      <input type="hidden" name="id" value={o.id} />
                      <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-red-600 hover:text-white">Eliminar</button>
                    </form>
                  </div>
                </div>

                <details className="rounded border p-3 bg-black/20">
                  <summary className="cursor-pointer text-sm font-medium">Editar</summary>
                  <form action={actualizarObligacion} className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="hidden" name="id" value={o.id} />
                    <select name="clienteId" required className="rounded border border-zinc-300 bg-white text-black px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                      <option value="">Selecciona cliente</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                    <input name="tipo" defaultValue={o.tipo} placeholder="Tipo" required className="rounded border bg-transparent px-3 py-2" />
                    <input name="periodo" defaultValue={o.periodo} placeholder="Periodo" required className="rounded border bg-transparent px-3 py-2" />
                    <input name="fechaLimite" type="date" defaultValue={formatDateInput(o.fechaLimite)} required className="rounded border bg-transparent px-3 py-2" />
                    <button type="submit" className="mt-1 rounded bg-white text-black px-3 py-2 text-sm font-medium sm:col-span-3">Guardar cambios</button>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export async function crearObligacion(formData: FormData) {
  "use server";
  const clienteId = String(formData.get("clienteId") || "").trim();
  const tipo = String(formData.get("tipo") || "").trim();
  const periodo = String(formData.get("periodo") || "").trim();
  const fechaLimiteRaw = String(formData.get("fechaLimite") || "");
  const fechaLimite = fechaLimiteRaw ? new Date(fechaLimiteRaw) : null;

  if (!clienteId || !tipo || !periodo || !fechaLimite) return;

  await prisma.obligacionFiscal.create({
    data: { clienteId, tipo, periodo, fechaLimite },
  });
  revalidatePath("/obligaciones");
}

export async function actualizarObligacion(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  const clienteId = String(formData.get("clienteId") || "").trim();
  const tipo = String(formData.get("tipo") || "").trim();
  const periodo = String(formData.get("periodo") || "").trim();
  const fechaLimiteRaw = String(formData.get("fechaLimite") || "");
  const fechaLimite = fechaLimiteRaw ? new Date(fechaLimiteRaw) : null;

  if (!clienteId || !tipo || !periodo || !fechaLimite) return;

  await prisma.obligacionFiscal.update({
    where: { id },
    data: { clienteId, tipo, periodo, fechaLimite },
  });

  revalidatePath("/obligaciones");
}

export async function eliminarObligacion(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  if (!id) return;
  try {
    await prisma.obligacionFiscal.delete({ where: { id } });
  } catch (e) {
    console.error("No se pudo eliminar la obligación", e);
  }
  revalidatePath("/obligaciones");
}

export async function actualizarEstadoObligacion(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  const estado = String(formData.get("estado") || "").trim().toUpperCase() as EstadoTarea;
  if (!id || !estado) return;
  await prisma.obligacionFiscal.update({ where: { id }, data: { estado } });
  revalidatePath("/obligaciones");
}