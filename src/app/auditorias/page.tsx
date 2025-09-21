export const dynamic = "force-dynamic";

import { PrismaClient } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export default async function AuditoriasPage({ searchParams }: { searchParams?: { estado?: string } }) {
  const estadoVista = (searchParams?.estado ?? "TODAS").toUpperCase();
  const where: any = estadoVista === "TODAS" ? {} : { estado: estadoVista };
  const auditorias = await prisma.auditoria.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { cliente: true },
  });
  const clientes = await prisma.cliente.findMany({ orderBy: { nombre: "asc" } });
  const formatDateInput = (d?: Date | null) => (d ? new Date(d).toISOString().split("T")[0] : "");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-semibold mb-4">Auditorías</h1>

      <section className="rounded-lg border p-4 mb-6">
        <h2 className="font-medium mb-3">Crear auditoría</h2>
        <form action={crearAuditoria} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="titulo" placeholder="Título" required className="rounded border bg-transparent px-3 py-2" />
          <select name="clienteId" required className="rounded border border-zinc-300 bg-white text-black px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
            <option value="">Selecciona cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <input name="fechaInicio" type="date" className="rounded border bg-transparent px-3 py-2" />
          <input name="fechaFin" type="date" className="rounded border bg-transparent px-3 py-2" />
          <textarea name="alcance" placeholder="Alcance (opcional)" className="rounded border bg-transparent px-3 py-2 sm:col-span-2" />
          <button type="submit" className="mt-1 rounded bg-white text-black px-3 py-2 text-sm font-medium sm:col-span-2">Guardar</button>
        </form>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="font-medium mb-3">Listado</h2>
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          {[
            { key: "TODAS", label: "Todas" },
            { key: "PENDIENTE", label: "Pendientes" },
            { key: "EN_PROCESO", label: "En proceso" },
            { key: "BLOQUEADO", label: "Bloqueadas" },
            { key: "COMPLETADO", label: "Completadas" },
          ].map((f) => (
            <a
              key={f.key}
              href={`/auditorias${f.key === "TODAS" ? "" : `?estado=${f.key}`}`}
              className={`rounded-full border px-2 py-1 ${estadoVista === f.key ? "bg-white text-black" : ""}`}
            >
              {f.label}
            </a>
          ))}
        </div>
        {auditorias.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aún no hay auditorías.</p>
        ) : (
          <ul className="space-y-2">
            {auditorias.map((a) => (
              <li key={a.id} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{a.titulo}</p>
                  <span className="text-xs text-muted-foreground">{a.cliente.nombre}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {a.fechaInicio ? new Date(a.fechaInicio).toLocaleDateString("es-CL") : ""}
                  {a.fechaFin ? ` → ${new Date(a.fechaFin).toLocaleDateString("es-CL")}` : ""}
                </p>

                <div className="flex items-center gap-2">
                  <form action={eliminarAuditoria}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-red-600 hover:text-white">Eliminar</button>
                  </form>
                </div>

                <details className="rounded border p-3 bg-black/20">
                  <summary className="cursor-pointer text-sm font-medium">Editar</summary>
                  <form action={actualizarAuditoria} className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="hidden" name="id" value={a.id} />
                    <input name="titulo" defaultValue={a.titulo ?? ""} placeholder="Título" required className="rounded border bg-transparent px-3 py-2" />
                    <select name="clienteId" defaultValue={a.clienteId} required className="rounded border border-zinc-300 bg-white text-black px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                      <option value="">Selecciona cliente</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                    <input name="fechaInicio" type="date" defaultValue={formatDateInput(a.fechaInicio)} className="rounded border bg-transparent px-3 py-2" />
                    <input name="fechaFin" type="date" defaultValue={formatDateInput(a.fechaFin)} className="rounded border bg-transparent px-3 py-2" />
                    <textarea name="alcance" defaultValue={a.alcance ?? ""} placeholder="Alcance (opcional)" className="rounded border bg-transparent px-3 py-2 sm:col-span-2" />
                    <button type="submit" className="mt-1 rounded bg-white text-black px-3 py-2 text-sm font-medium sm:col-span-2">Guardar cambios</button>
                  </form>
                </details>
                <div className="flex items-center gap-2">
                  <form action={actualizarEstadoAuditoriaSoloEstado} className="flex items-center gap-2 text-xs">
                    <input type="hidden" name="id" value={a.id} />
                    <select name="estado" defaultValue={a.estado} className="rounded border border-zinc-300 bg-white text-black px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EN_PROCESO">En proceso</option>
                      <option value="BLOQUEADO">Bloqueado</option>
                      <option value="COMPLETADO">Completado</option>
                    </select>
                    <button type="submit" className="rounded border px-2 py-1">Actualizar</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export async function crearAuditoria(formData: FormData) {
  "use server";
  const titulo = String(formData.get("titulo") || "").trim();
  const clienteId = String(formData.get("clienteId") || "").trim();
  const fechaInicioRaw = String(formData.get("fechaInicio") || "");
  const fechaFinRaw = String(formData.get("fechaFin") || "");
  const alcance = String(formData.get("alcance") || "").trim() || null;

  if (!titulo || !clienteId) return;

  const fechaInicio = fechaInicioRaw ? new Date(fechaInicioRaw) : null;
  const fechaFin = fechaFinRaw ? new Date(fechaFinRaw) : null;

  await prisma.auditoria.create({
    data: { titulo, clienteId, fechaInicio, fechaFin, alcance },
  });

  revalidatePath("/auditorias");
}

export async function actualizarAuditoria(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  const titulo = String(formData.get("titulo") || "").trim();
  const clienteId = String(formData.get("clienteId") || "").trim();
  const fechaInicioRaw = String(formData.get("fechaInicio") || "");
  const fechaFinRaw = String(formData.get("fechaFin") || "");
  const alcance = String(formData.get("alcance") || "").trim() || null;

  if (!titulo || !clienteId) return;

  const fechaInicio = fechaInicioRaw ? new Date(fechaInicioRaw) : null;
  const fechaFin = fechaFinRaw ? new Date(fechaFinRaw) : null;

  await prisma.auditoria.update({
    where: { id },
    data: { titulo, clienteId, fechaInicio, fechaFin, alcance },
  });

  revalidatePath("/auditorias");
}

export async function eliminarAuditoria(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  try {
    await prisma.auditoria.delete({ where: { id } });
  } catch (e) {
    console.error("No se pudo eliminar la auditoría", e);
  }

  revalidatePath("/auditorias");
}

export async function actualizarEstadoAuditoriaSoloEstado(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  const estado = String(formData.get("estado") || "").trim().toUpperCase() as any;
  if (!id || !estado) return;
  await prisma.auditoria.update({ where: { id }, data: { estado } });
  revalidatePath("/auditorias");
}