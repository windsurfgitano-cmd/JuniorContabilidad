# 🚀 Guía de Deployment en Vercel - TuContable

## 🔧 Variables de Entorno Requeridas en Vercel

### **Variables Críticas (SIN ESTAS NO FUNCIONARÁ)**

```env
# Base de datos PostgreSQL (OBLIGATORIO - Vercel no soporta SQLite)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Azure OpenAI (OBLIGATORIO para el asistente IA)
AZURE_OPENAI_ENDPOINT="https://your-resource-name.openai.azure.com"
AZURE_OPENAI_DEPLOYMENT_NAME="your-deployment-name"
AZURE_OPENAI_API_VERSION="2024-02-15-preview"
AZURE_OPENAI_API_KEY="your-api-key-here"

# Next.js (OBLIGATORIO)
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://your-app.vercel.app"
NODE_ENV="production"
```

### **Variables Específicas de Vercel**

```env
# Vercel específicas
VERCEL="1"
VERCEL_URL="your-app.vercel.app"

# Prisma para Vercel
PRISMA_GENERATE_DATAPROXY="true"
```

## 📋 Pasos para Deployment

### **1. Preparar Base de Datos**
```bash
# Opción 1: Neon (Recomendado)
# - Ve a https://neon.tech
# - Crea una nueva base de datos PostgreSQL
# - Copia la connection string

# Opción 2: Supabase
# - Ve a https://supabase.com
# - Crea un nuevo proyecto
# - Ve a Settings > Database
# - Copia la connection string
```

### **2. Configurar Variables en Vercel**
1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables
3. Agrega TODAS las variables del archivo `.env.example`
4. **IMPORTANTE**: Usa los valores reales, no los de ejemplo

### **3. Configurar Prisma para Producción**
```bash
# En tu proyecto local, actualiza el schema para producción
npx prisma generate
npx prisma db push
```

### **4. Deploy**
```bash
# Opción 1: Desde GitHub
# - Conecta tu repo a Vercel
# - Push tus cambios
# - Vercel deployará automáticamente

# Opción 2: Vercel CLI
npm i -g vercel
vercel --prod
```

## ⚠️ Errores Comunes y Soluciones

### **Error 500 Internal Server**
**Causa**: Variables de entorno faltantes o incorrectas

**Solución**:
1. Verifica que TODAS las variables estén configuradas
2. Especialmente `DATABASE_URL` y `AZURE_OPENAI_*`
3. Revisa los logs en Vercel Dashboard > Functions

### **Error de Base de Datos**
**Causa**: SQLite no funciona en Vercel

**Solución**:
1. Cambia a PostgreSQL (Neon/Supabase)
2. Actualiza `DATABASE_URL`
3. Ejecuta `npx prisma db push`

### **Error de Azure OpenAI**
**Causa**: Configuración incorrecta de Azure

**Solución**:
1. Verifica el endpoint (debe terminar en `.openai.azure.com`)
2. Confirma el deployment name
3. Valida la API key

## 🔍 Debugging en Vercel

### **Ver Logs**
1. Vercel Dashboard > Tu Proyecto
2. Functions tab
3. Click en cualquier función para ver logs

### **Logs en Tiempo Real**
```bash
vercel logs --follow
```

### **Variables de Entorno**
```bash
vercel env ls
```

## ✅ Checklist Pre-Deployment

- [ ] Base de datos PostgreSQL configurada
- [ ] Todas las variables de entorno agregadas en Vercel
- [ ] `DATABASE_URL` apunta a PostgreSQL (no SQLite)
- [ ] Azure OpenAI configurado correctamente
- [ ] `NEXTAUTH_URL` apunta a tu dominio de Vercel
- [ ] Build local exitoso (`npm run build`)
- [ ] Prisma schema sincronizado

## 🎯 URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon (Base de datos)**: https://neon.tech
- **Supabase (Alternativa)**: https://supabase.com
- **Azure OpenAI**: https://portal.azure.com

## 🚨 Variables Críticas para el Error 500

Si tienes error 500, verifica especialmente estas variables:

1. **`DATABASE_URL`** - Debe ser PostgreSQL válida
2. **`AZURE_OPENAI_ENDPOINT`** - Debe ser tu endpoint real
3. **`AZURE_OPENAI_API_KEY`** - Debe ser tu API key válida
4. **`AZURE_OPENAI_DEPLOYMENT_NAME`** - Debe coincidir con tu deployment
5. **`NODE_ENV`** - Debe ser "production"

¡Con estas configuraciones tu app funcionará perfectamente en Vercel! 🚀