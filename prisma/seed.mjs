import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

function addDays(base, days) { const d = new Date(base); d.setDate(d.getDate() + days); return d; }

try {
  // Seed básico y idempotente: limpia tablas pequeñas para demo (solo para sqlite/local)
  // Nota: En producción, elimina estos deletes.
  await prisma.recordatorio.deleteMany({});
  await prisma.tarea.deleteMany({});
  await prisma.obligacionFiscal?.deleteMany?.({});
  await prisma.auditoria?.deleteMany?.({});
  await prisma.cliente.deleteMany({});

  const hoy = new Date();

  const cliente = await prisma.cliente.create({
    data: {
      nombre: "Acme S.A.",
      ruc: "1799999999001",
      email: "contabilidad@acme.com",
      usuario: { create: { nombre: "Operador", email: `op-${Date.now()}@demo.local` } },
    },
  });

  const tareas = await Promise.all([
    prisma.tarea.create({ data: { titulo: "Recolectar facturas de agosto", prioridad: "ALTA", estado: "PENDIENTE", clienteId: cliente.id, fechaVencimiento: addDays(hoy, 3) } }),
    prisma.tarea.create({ data: { titulo: "Conciliar cuentas bancarias", prioridad: "MEDIA", estado: "EN_PROCESO", clienteId: cliente.id, fechaVencimiento: addDays(hoy, 1) } }),
    prisma.tarea.create({ data: { titulo: "Enviar ATS", prioridad: "CRITICA", estado: "BLOQUEADO", clienteId: cliente.id, fechaVencimiento: addDays(hoy, -1) } }),
    prisma.tarea.create({ data: { titulo: "Cerrar mes julio", prioridad: "ALTA", estado: "COMPLETADO", clienteId: cliente.id, fechaVencimiento: addDays(hoy, -5) } }),
  ]);

  // Recordatorios asociados a las dos primeras tareas
  await prisma.recordatorio.createMany({
    data: [
      { tareaId: tareas[0].id, fecha: addDays(hoy, 1), mensaje: "Revisar documentos recibidos", canal: "SISTEMA" },
      { tareaId: tareas[0].id, fecha: addDays(hoy, 2), mensaje: "Solicitar faltantes al cliente", canal: "EMAIL" },
      { tareaId: tareas[1].id, fecha: addDays(hoy, 0), mensaje: "Descargar extractos", canal: "SISTEMA" },
    ],
  });

  // Obligaciones fiscales de ejemplo
  await prisma.obligacionFiscal.createMany({
    data: [
      { tipo: "IVA", periodo: "2025-08", fechaLimite: addDays(hoy, 2), estado: "EN_PROCESO", clienteId: cliente.id },
      { tipo: "Retenciones", periodo: "2025-08", fechaLimite: addDays(hoy, 5), estado: "PENDIENTE", clienteId: cliente.id },
      { tipo: "Impuesto a la Renta", periodo: "2025-07", fechaLimite: addDays(hoy, -3), estado: "COMPLETADO", clienteId: cliente.id },
      { tipo: "ATS", periodo: "2025-08", fechaLimite: addDays(hoy, 1), estado: "BLOQUEADO", clienteId: cliente.id },
    ],
  });

  // Auditorías de ejemplo
  await prisma.auditoria.createMany({
    data: [
      { titulo: "Auditoría interna Q3", alcance: "Procesos contables", estado: "EN_PROCESO", clienteId: cliente.id, fechaInicio: addDays(hoy, -10), fechaFin: addDays(hoy, 20) },
      { titulo: "Revisión fiscal anual", alcance: "Estados financieros", estado: "PENDIENTE", clienteId: cliente.id, fechaInicio: addDays(hoy, 15), fechaFin: addDays(hoy, 45) },
      { titulo: "Auditoría de inventarios", alcance: "Control de stock", estado: "COMPLETADO", clienteId: cliente.id, fechaInicio: addDays(hoy, -30), fechaFin: addDays(hoy, -5) },
    ],
  });

  // Cliente adicional para mostrar más variedad
  const cliente2 = await prisma.cliente.create({
    data: {
      nombre: "Comercial Beta Ltda.",
      ruc: "1788888888001",
      email: "admin@beta.com",
      usuario: { create: { nombre: "Contador", email: `contador-${Date.now()}@demo.local` } },
    },
  });

  // Tareas para el segundo cliente
  await prisma.tarea.createMany({
    data: [
      { titulo: "Preparar declaración mensual", prioridad: "ALTA", estado: "PENDIENTE", clienteId: cliente2.id, fechaVencimiento: addDays(hoy, 7) },
      { titulo: "Revisar gastos deducibles", prioridad: "MEDIA", estado: "EN_PROCESO", clienteId: cliente2.id, fechaVencimiento: addDays(hoy, 10) },
    ],
  });

  console.log("Seed completado con éxito ✔");
} catch (e) {
  console.error("Error en seed:", e);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}