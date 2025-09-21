export const dynamic = "force-dynamic";

import { PrismaClient } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-semibold mb-4">Clientes</h1>

      <section className="rounded-lg border p-4 mb-6">
        <h2 className="font-medium mb-3">Agregar cliente</h2>
        <form action={crearCliente} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="nombre" placeholder="Nombre" required className="rounded border bg-transparent px-3 py-2" />
          <input name="ruc" placeholder="RUT (opcional)" className="rounded border bg-transparent px-3 py-2" />
          <input name="email" type="email" placeholder="Email (opcional)" className="rounded border bg-transparent px-3 py-2" />
          <input name="telefono" placeholder="Teléfono (opcional)" className="rounded border bg-transparent px-3 py-2" />
          <input name="direccion" placeholder="Dirección (opcional)" className="rounded border bg-transparent px-3 py-2 sm:col-span-2" />
          <button type="submit" className="mt-1 rounded bg-white text-black px-3 py-2 text-sm font-medium sm:col-span-2">Guardar</button>
        </form>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="font-medium mb-3">Listado</h2>
        {clientes.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aún no hay clientes.</p>
        ) : (
          <ul className="space-y-2">
            {clientes.map((c) => (
              <li key={c.id} className="space-y-3 border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.nombre}</p>
                    <p className="text-sm text-muted-foreground">{c.email ?? ""} {c.ruc ? `· RUT ${c.ruc}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={eliminarCliente}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-red-600 hover:text-white">Eliminar</button>
                    </form>
                  </div>
                </div>
                <details className="rounded border p-3 bg-black/20">
                  <summary className="cursor-pointer text-sm font-medium">Editar</summary>
                  <form action={actualizarCliente} className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="hidden" name="id" value={c.id} />
                    <input name="nombre" defaultValue={c.nombre ?? ""} placeholder="Nombre" required className="rounded border bg-transparent px-3 py-2" />
                    <input name="ruc" defaultValue={c.ruc ?? ""} placeholder="RUT (opcional)" className="rounded border bg-transparent px-3 py-2" />
                    <input name="email" type="email" defaultValue={c.email ?? ""} placeholder="Email (opcional)" className="rounded border bg-transparent px-3 py-2" />
                    <input name="telefono" defaultValue={c.telefono ?? ""} placeholder="Teléfono (opcional)" className="rounded border bg-transparent px-3 py-2" />
                    <input name="direccion" defaultValue={c.direccion ?? ""} placeholder="Dirección (opcional)" className="rounded border bg-transparent px-3 py-2 sm:col-span-2" />
                    <button type="submit" className="mt-1 rounded bg-white text-black px-3 py-2 text-sm font-medium sm:col-span-2">Guardar cambios</button>
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

export async function crearCliente(formData: FormData) {
  "use server";

  const nombre = String(formData.get("nombre") || "").trim();
  const ruc = String(formData.get("ruc") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const telefono = String(formData.get("telefono") || "").trim() || null;
  const direccion = String(formData.get("direccion") || "").trim() || null;

  if (!nombre) return;

  // Asegurar usuario demo por ahora (sin auth)
  const usuario = await prisma.usuario.upsert({
    where: { email: "demo@local" },
    update: {},
    create: { nombre: "Demo", email: "demo@local" },
  });

  await prisma.cliente.create({
    data: { nombre, ruc, email, telefono, direccion, usuarioId: usuario.id },
  });

  revalidatePath("/clientes");
}

export async function actualizarCliente(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  const nombre = String(formData.get("nombre") || "").trim();
  const ruc = String(formData.get("ruc") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const telefono = String(formData.get("telefono") || "").trim() || null;
  const direccion = String(formData.get("direccion") || "").trim() || null;

  if (!nombre) return;

  await prisma.cliente.update({
    where: { id },
    data: { nombre, ruc, email, telefono, direccion },
  });

  revalidatePath("/clientes");
}

export async function eliminarCliente(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  try {
    await prisma.cliente.delete({ where: { id } });
  } catch (e) {
    console.error("No se pudo eliminar el cliente", e);
  }

  revalidatePath("/clientes");
}