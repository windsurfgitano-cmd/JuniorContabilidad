export const dynamic = "force-dynamic";

import { PrismaClient } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

import { Prioridad, EstadoTarea, CanalRecordatorio, Prisma } from "@/generated/prisma";

const prisma = new PrismaClient();

export default async function TareasPage({ searchParams }: { searchParams?: { estado?: string } }) {
  const estadoFiltro = (searchParams?.estado ?? "TODAS").toUpperCase();
  const where: Prisma.TareaWhereInput = estadoFiltro === "TODAS" ? {} : { estado: estadoFiltro as EstadoTarea };

  const tareas = await prisma.tarea.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { cliente: true, obligacion: true, auditoria: true, recordatorios: true },
  });

  const formatDateInput = (d?: Date | null) => (d ? new Date(d).toISOString().split("T")[0] : "");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-semibold mb-4">Tareas</h1>

      <section className="rounded-lg border p-4 mb-6">
        <h2 className="font-medium mb-3">Agregar tarea</h2>
        <form action={crearTarea} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input name="titulo" placeholder="Título" required className="rounded border bg-transparent px-3 py-2 sm:col-span-2" />
          <select name="prioridad" defaultValue="MEDIA" className="rounded border border-zinc-300 bg-white text-black px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
          <input name="fechaVencimiento" type="date" className="rounded border bg-transparent px-3 py-2" />
          <input name="descripcion" placeholder="Descripción" className="rounded border bg-transparent px-3 py-2 sm:col-span-3" />
          <button type="submit" className="mt-1 rounded bg-white text-black px-3 py-2 text-sm font-medium sm:col-span-3">Guardar</button>
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
              href={`/tareas${f.key === "TODAS" ? "" : `?estado=${f.key}`}`}
              className={`rounded-full border px-2 py-1 ${
                estadoFiltro === f.key ? "bg-white text-black" : ""
              }`}
            >
              {f.label}
            </a>
          ))}
        </div>
        {tareas.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aún no hay tareas.</p>
        ) : (
          <ul className="space-y-2">
            {tareas.map((t) => (
              <li key={t.id} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{t.titulo}</p>
                  <span className="text-xs text-muted-foreground">{t.estado} · {t.prioridad}</span>
                </div>
                {t.descripcion ? (
                  <p className="text-sm text-muted-foreground">{t.descripcion}</p>
                ) : null}
                {t.fechaVencimiento ? (
                  <p className="text-xs text-muted-foreground">Vence: {new Date(t.fechaVencimiento).toLocaleDateString("es-CL")}</p>
                ) : null}

                <div className="flex items-center gap-2">
                  <form action={eliminarTarea}>
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-red-600 hover:text-white">Eliminar</button>
                  </form>
                  <form action={actualizarEstadoTarea} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={t.id} />
                    <select name="estado" defaultValue={t.estado} className="rounded border border-zinc-300 bg-white text-black px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EN_PROCESO">En proceso</option>
                      <option value="BLOQUEADO">Bloqueado</option>
                      <option value="COMPLETADO">Completado</option>
                    </select>
                    <button type="submit" className="rounded border px-2 py-1 text-xs">Actualizar</button>
                  </form>
                </div>

                <details className="rounded border p-3 bg-black/20">
                  <summary className="cursor-pointer text-sm font-medium">Editar</summary>
                  <form action={actualizarTarea} className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="hidden" name="id" value={t.id} />
                    <input name="titulo" defaultValue={t.titulo ?? ""} placeholder="Título" required className="rounded border bg-transparent px-3 py-2 sm:col-span-2" />
                    <select name="prioridad" defaultValue={t.prioridad} className="rounded border border-zinc-300 bg-white text-black px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                      <option value="CRITICA">Crítica</option>
                    </select>
                    <select name="estado" defaultValue={t.estado} className="rounded border border-zinc-300 bg-white text-black px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EN_PROCESO">En proceso</option>
                      <option value="BLOQUEADO">Bloqueado</option>
                      <option value="COMPLETADO">Completado</option>
                    </select>
                    <input name="fechaVencimiento" type="date" defaultValue={formatDateInput(t.fechaVencimiento)} className="rounded border bg-transparent px-3 py-2" />
                    <textarea name="descripcion" defaultValue={t.descripcion ?? ""} placeholder="Descripción (opcional)" className="rounded border bg-transparent px-3 py-2 sm:col-span-3" />
                    <button type="submit" className="mt-1 rounded bg-white text-black px-3 py-2 text-sm font-medium sm:col-span-3">Guardar cambios</button>
                  </form>
                </details>

                <details className="rounded border p-3 bg-black/10">
                  <summary className="cursor-pointer text-sm font-medium">Recordatorios ({t.recordatorios.length})</summary>
                  <ul className="mt-2 space-y-2">
                    {t.recordatorios.map((r) => (
                      <li key={r.id} className="flex items-center justify-between text-sm">
                        <span>
                          {new Date(r.fecha).toLocaleDateString("es-CL")} · {r.canal} — {r.mensaje}
                        </span>
                        <form action={eliminarRecordatorio}>
                          <input type="hidden" name="id" value={r.id} />
                          <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-red-600 hover:text-white">Eliminar</button>
                        </form>
                      </li>
                    ))}
                  </ul>
                  <form action={crearRecordatorio} className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input type="hidden" name="tareaId" value={t.id} />
                    <input name="fecha" type="date" required className="rounded border bg-transparent px-3 py-2" />
                    <input name="mensaje" placeholder="Mensaje" required className="rounded border bg-transparent px-3 py-2 sm:col-span-2" />
                    <select name="canal" defaultValue="SISTEMA" className="rounded border border-zinc-300 bg-white text-black px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                      <option value="SISTEMA">Sistema</option>
                      <option value="EMAIL">Email</option>
                    </select>
                    <button type="submit" className="rounded bg-white text-black px-3 py-2 text-sm font-medium sm:col-span-4">Agregar recordatorio</button>
                  </form>
                </details>

                <div className="flex items-center justify-between">
                  <form action={eliminarTarea}>
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-red-600 hover:text-white">Eliminar</button>
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

export async function crearTarea(formData: FormData) {
  "use server";

  const titulo = String(formData.get("titulo") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim() || null;
  const prioridad = (String(formData.get("prioridad") || "MEDIA").toUpperCase()) as Prioridad;
  const fechaVencimientoRaw = String(formData.get("fechaVencimiento") || "");
  const fechaVencimiento = fechaVencimientoRaw ? new Date(fechaVencimientoRaw) : null;

  if (!titulo) return;

  await prisma.tarea.create({ data: { titulo, descripcion, prioridad, fechaVencimiento } });
  revalidatePath("/tareas");
}

export async function actualizarTarea(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  const titulo = String(formData.get("titulo") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim() || null;
  const prioridad = (String(formData.get("prioridad") || "MEDIA").toUpperCase()) as Prioridad;
  const estado = (String(formData.get("estado") || "PENDIENTE").toUpperCase()) as EstadoTarea;
  const fechaVencimientoRaw = String(formData.get("fechaVencimiento") || "");
  const fechaVencimiento = fechaVencimientoRaw ? new Date(fechaVencimientoRaw) : null;

  if (!titulo) return;

  await prisma.tarea.update({
    where: { id },
    data: { titulo, descripcion, prioridad, estado, fechaVencimiento },
  });

  revalidatePath("/tareas");
}

export async function eliminarTarea(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  try {
    await prisma.tarea.delete({ where: { id } });
  } catch (e) {
    console.error("No se pudo eliminar la tarea", e);
  }

  revalidatePath("/tareas");
}

export async function actualizarEstadoTarea(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  const estado = String(formData.get("estado") || "").toUpperCase();
  if (!id || !estado) return;

  await prisma.tarea.update({ where: { id }, data: { estado: estado as EstadoTarea } });
  revalidatePath("/tareas");
}

export async function crearRecordatorio(formData: FormData) {
  "use server";
  const tareaId = String(formData.get("tareaId") || "").trim();
  const fechaRaw = String(formData.get("fecha") || "");
  const mensaje = String(formData.get("mensaje") || "").trim();
  const canal = (String(formData.get("canal") || "SISTEMA").toUpperCase()) as CanalRecordatorio;
  if (!tareaId || !fechaRaw || !mensaje) return;
  const fecha = new Date(fechaRaw);
  await prisma.recordatorio.create({ data: { tareaId, fecha, mensaje, canal } });
  revalidatePath("/tareas");
}

export async function eliminarRecordatorio(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "").trim();
  if (!id) return;
  await prisma.recordatorio.delete({ where: { id } });
  revalidatePath("/tareas");
}