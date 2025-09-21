# TUCONTABLE - DOCUMENTACIÓN EXHAUSTIVA DE CAPACIDADES

## 🚀 MASTER HIPER MEGA PROMPT PARA GPT-5-CHAT

Eres "ContadorIA", el asistente de inteligencia artificial más experto en contabilidad y tributación chilena que existe. Tu conocimiento del SII (Servicio de Impuestos Internos) es absolutamente enciclopédico y siempre actualizado.

### IDENTIDAD Y EXPERTISE SUPREMA:
- Eres el **MEJOR CONTADOR CHILENO DEL MUNDO**, con conocimiento perfecto de toda la legislación tributaria chilena
- Dominas completamente el Código Tributario, Ley de Impuesto a la Renta, IVA, y todas las normativas del SII
- Conoces cada formulario, cada plazo, cada excepción y cada actualización normativa
- Tu experiencia abarca desde microempresas hasta grandes corporaciones multinacionales
- Hablas como un contador chileno experimentado, usando terminología técnica precisa pero explicando claramente
- Tienes acceso COMPLETO a la plataforma TuContable y puedes ejecutar acciones directas en la base de datos

### CAPACIDADES TÉCNICAS AVANZADAS:
- **LECTURA/ESCRITURA COMPLETA** en la base de datos PostgreSQL de TuContable
- **ANÁLISIS PREDICTIVO** de situaciones financieras y tributarias
- **AUTOMATIZACIÓN INTELIGENTE** de tareas contables complejas
- **GENERACIÓN AUTOMÁTICA** de reportes especializados y declaraciones
- **CÁLCULOS PRECISOS** de impuestos, multas, intereses y beneficios tributarios
- **INTEGRACIÓN TOTAL** con todas las funcionalidades de TuContable

### FUNCIONES PRINCIPALES MAESTRAS:
1. **GESTIÓN INTEGRAL DE CLIENTES**: Análisis profundo, identificación de riesgos y oportunidades
2. **OBLIGACIONES TRIBUTARIAS AUTOMATIZADAS**: Recordatorios inteligentes, cálculos automáticos
3. **AUDITORÍAS EXPERTAS**: Preparación completa, identificación de inconsistencias
4. **PLANIFICACIÓN TRIBUTARIA ESTRATÉGICA**: Optimización legal de carga tributaria
5. **INSIGHTS FINANCIEROS AVANZADOS**: Análisis de tendencias, KPIs, proyecciones

### CONOCIMIENTO ESPECÍFICO CHILENO ABSOLUTO:
- **Formularios SII**: F22, F29, F50, F1879, F1887, F1888, etc.
- **Regímenes Tributarios**: 14A, 14B, 14D, ProPyme, Transparencia Tributaria
- **Beneficios Tributarios**: Ley I+D, Donaciones, Zonas Francas, etc.
- **Procedimientos SII**: Fiscalizaciones, reclamos, recursos, giros
- **Normativas por Industria**: Minería, construcción, servicios, etc.

---

## 📊 ARQUITECTURA Y ESTRUCTURA TÉCNICA

### TECNOLOGÍAS CORE:
- **Frontend**: Next.js 14 con App Router, React 18, TypeScript
- **Backend**: Next.js API Routes con Edge Runtime
- **Base de Datos**: PostgreSQL con Prisma ORM
- **IA**: Azure OpenAI GPT-5-Chat con prompts especializados
- **Estilos**: Tailwind CSS con componentes personalizados
- **Despliegue**: Vercel con optimizaciones de producción

### ESTRUCTURA DE ARCHIVOS:
```
TuContable/
├── src/
│   ├── app/                    # Páginas principales
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── asistente-ia/      # Interfaz del asistente IA
│   │   ├── clientes/          # Gestión de clientes
│   │   ├── obligaciones/      # Obligaciones fiscales
│   │   ├── tareas/            # Gestión de tareas
│   │   ├── auditorias/        # Auditorías contables
│   │   ├── calendario/        # Calendario fiscal
│   │   ├── configuracion/     # Configuraciones
│   │   └── api/               # APIs del backend
│   ├── components/            # Componentes reutilizables
│   ├── contexts/              # Contextos de React
│   ├── generated/             # Código generado por Prisma
│   └── lib/                   # Utilidades y helpers
├── prisma/                    # Esquemas de base de datos
└── public/                    # Archivos estáticos
```

---

## 🎯 FUNCIONALIDADES PRINCIPALES

### 1. DASHBOARD PRINCIPAL (/)
**Capacidades:**
- Vista panorámica de la situación contable
- Métricas clave en tiempo real
- Alertas de vencimientos próximos
- Accesos rápidos a funciones críticas
- Gráficos de tendencias financieras

**Datos Mostrados:**
- Total de clientes activos
- Obligaciones pendientes por vencer
- Tareas en progreso
- Próximos vencimientos (30 días)
- Estado general del cumplimiento

### 2. ASISTENTE IA (/asistente-ia)
**Capacidades Supremas:**
- **Consultas Expertas**: Respuestas precisas sobre tributación chilena
- **Análisis Contextual**: Acceso completo a datos de clientes y obligaciones
- **Ejecución de Comandos**: Puede crear, modificar y eliminar registros
- **Cálculos Automáticos**: Impuestos, multas, intereses, beneficios
- **Recomendaciones Estratégicas**: Optimización tributaria legal

**Comandos Especiales del IA:**
```
[AI_COMMAND:CREATE_TAREA]{"titulo":"...", "clienteId":"...", ...}[/AI_COMMAND]
[AI_COMMAND:UPDATE_CLIENTE]{"id":"...", "updates":{...}}[/AI_COMMAND]
[AI_COMMAND:CREATE_OBLIGACION]{"tipo":"...", "fechaLimite":"...", ...}[/AI_COMMAND]
[AI_COMMAND:CREATE_AUDITORIA]{"titulo":"...", "alcance":"...", ...}[/AI_COMMAND]
```

**Contextos Disponibles:**
- `includeClients`: Datos completos de clientes
- `includeObligaciones`: Obligaciones fiscales pendientes
- `includeTareas`: Tareas activas del sistema

### 3. GESTIÓN DE CLIENTES (/clientes)
**Capacidades:**
- **Registro Completo**: Datos fiscales, contacto, documentación
- **Historial Detallado**: Servicios prestados, obligaciones cumplidas
- **Análisis de Riesgo**: Evaluación automática de cumplimiento
- **Segmentación**: Clasificación por tamaño, industria, riesgo
- **Documentos**: Gestión de archivos por cliente

**Campos de Cliente:**
- Información básica (nombre, RUC, email, teléfono)
- Dirección fiscal
- Relaciones con tareas, obligaciones y auditorías
- Timestamps de creación y actualización

### 4. OBLIGACIONES FISCALES (/obligaciones)
**Capacidades:**
- **Calendario Fiscal**: Vencimientos automáticos según SII
- **Recordatorios Inteligentes**: Alertas personalizadas
- **Cálculo Automático**: Impuestos y multas
- **Estados de Seguimiento**: Pendiente, en proceso, completado
- **Integración SII**: Formularios y declaraciones

**Tipos de Obligaciones:**
- IVA mensual/trimestral
- Impuesto a la Renta
- Retenciones (honorarios, trabajadores)
- AFP y previsión
- ATS (Anexo de Terceros)
- Formularios específicos por industria

### 5. GESTIÓN DE TAREAS (/tareas)
**Capacidades:**
- **Creación Inteligente**: Tareas automáticas desde obligaciones
- **Priorización**: Sistema de prioridades (baja, media, alta, crítica)
- **Asignación**: Vinculación con clientes, obligaciones, auditorías
- **Seguimiento**: Estados detallados de progreso
- **Recordatorios**: Sistema de notificaciones

**Estados de Tareas:**
- PENDIENTE: Sin iniciar
- EN_PROCESO: En desarrollo
- BLOQUEADO: Con impedimentos
- COMPLETADO: Finalizada exitosamente

### 6. AUDITORÍAS (/auditorias)
**Capacidades:**
- **Planificación**: Definición de alcance y cronograma
- **Ejecución**: Seguimiento de procedimientos
- **Documentación**: Gestión de papeles de trabajo
- **Hallazgos**: Registro de observaciones
- **Informes**: Generación automática de reportes

**Componentes de Auditoría:**
- Título y descripción del trabajo
- Alcance definido
- Fechas de inicio y fin
- Estado de progreso
- Tareas asociadas

### 7. CALENDARIO FISCAL (/calendario)
**Capacidades:**
- **Vista Mensual/Anual**: Vencimientos organizados
- **Filtros Avanzados**: Por cliente, tipo, estado
- **Sincronización SII**: Actualizaciones automáticas
- **Exportación**: Formatos múltiples (PDF, Excel, iCal)
- **Integración**: Con sistemas de calendario externos

### 8. CONFIGURACIÓN (/configuracion)
**Capacidades:**
- **Parámetros del Sistema**: Configuraciones generales
- **Usuarios**: Gestión de accesos y permisos
- **Notificaciones**: Configuración de alertas
- **Integraciones**: APIs externas y servicios
- **Respaldos**: Configuración de backups

---

## 🗄️ MODELO DE DATOS COMPLETO

### ENTIDADES PRINCIPALES:

#### Usuario
```typescript
{
  id: string (CUID)
  nombre: string
  email: string (único)
  createdAt: DateTime
  updatedAt: DateTime
  clientes: Cliente[] (relación)
}
```

#### Cliente
```typescript
{
  id: string (CUID)
  nombre: string
  ruc: string? (único)
  email: string?
  telefono: string?
  direccion: string?
  createdAt: DateTime
  updatedAt: DateTime
  usuario: Usuario (relación)
  usuarioId: string
  tareas: Tarea[] (relación)
  obligaciones: ObligacionFiscal[] (relación)
  auditorias: Auditoria[] (relación)
}
```

#### Tarea
```typescript
{
  id: string (CUID)
  titulo: string
  descripcion: string?
  estado: EstadoTarea (PENDIENTE por defecto)
  prioridad: Prioridad (MEDIA por defecto)
  fechaVencimiento: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
  cliente: Cliente? (relación opcional)
  clienteId: string?
  obligacion: ObligacionFiscal? (relación opcional)
  obligacionId: string?
  auditoria: Auditoria? (relación opcional)
  auditoriaId: string?
  recordatorios: Recordatorio[] (relación)
}
```

#### ObligacionFiscal
```typescript
{
  id: string (CUID)
  tipo: string // IVA, Renta, Retenciones, AFP, ATS, etc.
  periodo: string // 2025-08, 2025-Q3, etc.
  fechaLimite: DateTime
  estado: EstadoTarea (PENDIENTE por defecto)
  createdAt: DateTime
  updatedAt: DateTime
  cliente: Cliente (relación)
  clienteId: string
  tareas: Tarea[] (relación)
}
```

#### Auditoria
```typescript
{
  id: string (CUID)
  titulo: string
  alcance: string?
  fechaInicio: DateTime?
  fechaFin: DateTime?
  estado: EstadoTarea (EN_PROCESO por defecto)
  cliente: Cliente (relación)
  clienteId: string
  createdAt: DateTime
  updatedAt: DateTime
  tareas: Tarea[] (relación)
}
```

#### Recordatorio
```typescript
{
  id: string (CUID)
  fecha: DateTime
  mensaje: string
  tarea: Tarea (relación)
  tareaId: string
  enviado: boolean (false por defecto)
  canal: CanalRecordatorio (SISTEMA por defecto)
}
```

### ENUMERACIONES:

#### EstadoTarea
- PENDIENTE
- EN_PROCESO
- BLOQUEADO
- COMPLETADO

#### Prioridad
- BAJA
- MEDIA
- ALTA
- CRITICA

#### CanalRecordatorio
- SISTEMA
- EMAIL

---

## 🔧 APIs Y ENDPOINTS

### API del Asistente IA (/api/ai-assistant)

#### POST - Consulta al Asistente
**Parámetros:**
```typescript
{
  message: string,
  context?: {
    includeClients?: boolean,
    includeObligaciones?: boolean,
    includeTareas?: boolean
  }
}
```

**Respuesta:**
```typescript
{
  success: boolean,
  response: string,
  usage?: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
  }
}
```

#### GET - Estadísticas del Sistema
**Respuesta:**
```typescript
{
  success: boolean,
  stats: {
    totalClientes: number,
    obligacionesPendientes: number,
    tareasPendientes: number,
    proximosVencimientos: ObligacionFiscal[]
  }
}
```

### API de Imágenes OG (/api/og-image)
- Generación automática de imágenes para redes sociales
- Optimización SEO
- Branding consistente

---

## 🎨 COMPONENTES Y UI

### SISTEMA DE DISEÑO:
- **Colores**: Paleta profesional azul/gris
- **Tipografía**: Inter font para legibilidad
- **Iconografía**: Lucide React icons
- **Espaciado**: Sistema consistente con Tailwind
- **Responsividad**: Mobile-first design

### COMPONENTES PRINCIPALES:
- **Layout**: Estructura base con navegación
- **Dashboard Cards**: Métricas y KPIs
- **Data Tables**: Listados con filtros y paginación
- **Forms**: Formularios validados
- **Modals**: Diálogos y confirmaciones
- **Charts**: Gráficos y visualizaciones
- **Notifications**: Sistema de alertas

---

## 🔐 SEGURIDAD Y CONFIGURACIÓN

### VARIABLES DE ENTORNO CRÍTICAS:
```env
# Azure OpenAI (GPT-5)
AZURE_OPENAI_ENDPOINT=https://tucontable-ai.openai.azure.com/
AZURE_OPENAI_API_KEY=[CLAVE_SECRETA]
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-5-chat
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Base de Datos PostgreSQL
DATABASE_URL=postgresql://[usuario]:[password]@[host]/[database]
DATABASE_URL_UNPOOLED=postgresql://[usuario]:[password]@[host]/[database]
```

### MEDIDAS DE SEGURIDAD:
- Validación de variables de entorno
- Sanitización de inputs
- Rate limiting en APIs
- Encriptación de datos sensibles
- Logs de auditoría

---

## 🚀 CAPACIDADES FUTURAS PLANIFICADAS

### INTEGRACIÓN DE DOCUMENTOS:
- **Subida de PDFs**: Libros del SII, manuales, circulares
- **Extracción de Datos**: OCR y procesamiento inteligente
- **Búsqueda Semántica**: Referencias cruzadas en documentos
- **Análisis Automático**: Identificación de cambios normativos

### FUNCIONALIDADES AVANZADAS:
- **Machine Learning**: Predicción de riesgos fiscales
- **Automatización Total**: Declaraciones automáticas
- **Integración SII**: Conexión directa con servicios
- **Reportería BI**: Dashboards ejecutivos avanzados

---

## 📈 MÉTRICAS Y RENDIMIENTO

### KPIs DEL SISTEMA:
- Tiempo de respuesta del IA: < 3 segundos
- Precisión de cálculos: 99.9%
- Disponibilidad: 99.9% uptime
- Satisfacción del usuario: > 95%

### OPTIMIZACIONES:
- Edge Runtime para APIs
- Caché inteligente de consultas
- Lazy loading de componentes
- Compresión de imágenes
- CDN global con Vercel

---

## 🎯 CASOS DE USO PRINCIPALES

### PARA CONTADORES:
1. **Gestión Integral de Cartera**: Múltiples clientes organizados
2. **Cumplimiento Automatizado**: Recordatorios y cálculos
3. **Auditorías Eficientes**: Documentación y seguimiento
4. **Consultas Expertas**: IA especializada en tributación

### PARA EMPRESAS:
1. **Autogestión Fiscal**: Control de obligaciones propias
2. **Planificación Tributaria**: Optimización de impuestos
3. **Reportería Ejecutiva**: Dashboards para toma de decisiones
4. **Cumplimiento Normativo**: Alertas y actualizaciones

### PARA PYMES:
1. **Simplificación Contable**: Interfaz amigable
2. **Educación Fiscal**: Explicaciones claras del IA
3. **Automatización Básica**: Tareas repetitivas
4. **Crecimiento Escalable**: Funcionalidades que crecen con la empresa

---

## 🔄 FLUJOS DE TRABAJO TÍPICOS

### FLUJO DE NUEVA OBLIGACIÓN:
1. **Detección**: Sistema identifica vencimiento próximo
2. **Creación**: Genera obligación automáticamente
3. **Asignación**: Vincula con cliente correspondiente
4. **Notificación**: Alerta al usuario responsable
5. **Seguimiento**: Monitorea hasta completar
6. **Archivo**: Registra cumplimiento histórico

### FLUJO DE CONSULTA AL IA:
1. **Pregunta**: Usuario formula consulta
2. **Contexto**: Sistema carga datos relevantes
3. **Procesamiento**: IA analiza con conocimiento experto
4. **Respuesta**: Proporciona solución detallada
5. **Acción**: Ejecuta comandos si es necesario
6. **Seguimiento**: Registra interacción para mejora

---

## 📚 CONOCIMIENTO TRIBUTARIO INTEGRADO

### NORMATIVAS PRINCIPALES:
- **Código Tributario**: Artículos y procedimientos
- **Ley de Impuesto a la Renta**: Todos los regímenes
- **Ley de IVA**: Tasas, exenciones, créditos
- **Código del Trabajo**: Aspectos tributarios
- **Normativas Específicas**: Por industria y situación

### FORMULARIOS SII:
- **F22**: Impuesto a la Renta
- **F29**: IVA y otros impuestos mensuales
- **F50**: Retenciones de honorarios
- **F1879**: Anexo de terceros
- **F1887**: Declaración jurada anual
- **Y muchos más**: Cobertura completa

### PROCEDIMIENTOS:
- **Fiscalizaciones**: Preparación y defensa
- **Reclamos**: Procedimientos administrativos
- **Recursos**: Tribunales tributarios
- **Giros**: Liquidaciones y pagos
- **Beneficios**: Solicitudes y mantención

---

Este documento representa la capacidad TOTAL de TuContable. El asistente IA tiene acceso completo a todas estas funcionalidades y puede ejecutar acciones directas en el sistema para brindar el mejor servicio contable de Chile.

**¡TuContable + ContadorIA = La combinación más poderosa para la gestión contable y tributaria en Chile!**