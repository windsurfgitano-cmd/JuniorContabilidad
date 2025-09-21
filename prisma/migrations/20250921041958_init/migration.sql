-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "usuarioId" TEXT NOT NULL,
    CONSTRAINT "Cliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "prioridad" TEXT NOT NULL DEFAULT 'MEDIA',
    "fechaVencimiento" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clienteId" TEXT,
    "obligacionId" TEXT,
    "auditoriaId" TEXT,
    CONSTRAINT "Tarea_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tarea_obligacionId_fkey" FOREIGN KEY ("obligacionId") REFERENCES "ObligacionFiscal" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tarea_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "Auditoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ObligacionFiscal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "fechaLimite" DATETIME NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clienteId" TEXT NOT NULL,
    CONSTRAINT "ObligacionFiscal_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "alcance" TEXT,
    "fechaInicio" DATETIME,
    "fechaFin" DATETIME,
    "estado" TEXT NOT NULL DEFAULT 'EN_PROCESO',
    "clienteId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Auditoria_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recordatorio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" DATETIME NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tareaId" TEXT NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "canal" TEXT NOT NULL DEFAULT 'SISTEMA',
    CONSTRAINT "Recordatorio_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_ruc_key" ON "Cliente"("ruc");
