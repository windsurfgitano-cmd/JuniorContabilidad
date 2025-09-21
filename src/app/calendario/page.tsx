export const dynamic = "force-dynamic";

import { PrismaClient } from "@/generated/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export default async function CalendarioPage() {
  const hoy = new Date();
  const en7dias = new Date();
  en7dias.setDate(hoy.getDate() + 7);

  const obligaciones = await prisma.obligacionFiscal.findMany({
    where: { fechaLimite: { gte: hoy, lte: en7dias } },
    include: { cliente: true },
    orderBy: { fechaLimite: "asc" },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-semibold mb-4">Calendario</h1>
      {obligaciones.length === 0 ? (
        <p className="text-muted-foreground">No hay obligaciones en los próximos días.</p>
      ) : (
        <ul className="space-y-2">
          {obligaciones.map((o) => (
            <li key={o.id} className="border rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{o.tipo} — {o.periodo} · {o.cliente.nombre}</p>
                <p className="text-sm text-muted-foreground">Vence: {format(o.fechaLimite, "dd/MM/yyyy")}</p>
              </div>
              <Link className="underline text-sm" href="/obligaciones">Ver</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}