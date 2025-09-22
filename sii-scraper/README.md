# 🏛️ SII Scraper - Recopilador de Normativa Tributaria

Sistema automatizado para descargar y organizar la documentación oficial del Servicio de Impuestos Internos (SII) de Chile y leyes tributarias desde LeyChile.cl.

## 📋 Descripción

Este proyecto contiene scripts independientes para:

- **Leyes Tributarias**: Descarga automática desde LeyChile.cl
- **Normativa SII**: Resoluciones, circulares, oficios y schemas XML
- **Organización**: Estructura de carpetas por tipo y año
- **Logging**: Registro detallado de todas las operaciones

## 🗂️ Estructura del Proyecto

```
sii-scraper/
├── leychile_scraper.py     # Scraper para leyes desde LeyChile.cl
├── sii_scraper.py          # Scraper para normativa del SII
├── requirements.txt        # Dependencias Python
├── README.md              # Este archivo
├── leyes/                 # Leyes tributarias descargadas
├── resoluciones/          # Resoluciones SII por año
├── circulares/            # Circulares SII por año
├── oficios/               # Oficios SII
├── schemas/               # Schemas XML de documentos electrónicos
├── data/                  # Reportes y metadatos
└── logs/                  # Archivos de log
```

## 🚀 Instalación

### 1. Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Conexión a internet estable

### 2. Instalación de Dependencias

```bash
# Navegar a la carpeta del proyecto
cd sii-scraper

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Verificación de Instalación

```bash
python -c "import requests, bs4; print('✓ Dependencias instaladas correctamente')"
```

## 📖 Uso

### Scraper de Leyes Tributarias (LeyChile.cl)

```bash
# Ejecutar descarga de leyes tributarias
python leychile_scraper.py
```

**Características:**
- Descarga las principales leyes tributarias chilenas
- Organiza por tipo de ley
- Manejo de errores y reintentos automáticos
- Log detallado de operaciones

**Leyes incluidas:**
- Código Tributario
- Ley de Impuesto a la Renta
- Ley de IVA
- Ley de Timbres y Estampillas
- Código de Procedimiento Tributario
- Y más...

### Scraper de Normativa SII

```bash
# Ejecutar descarga completa de normativa SII
python sii_scraper.py
```

**Características:**
- Descarga resoluciones de los últimos 5 años
- Descarga circulares por año
- Obtiene schemas XML de documentos electrónicos
- Genera reportes en formato JSON
- Evita duplicados automáticamente

## 📊 Reportes y Logs

### Archivos de Log

Los logs se guardan en la carpeta `logs/`:
- `leychile_scraper.log`: Log del scraper de leyes
- `sii_scraper.log`: Log del scraper del SII

### Reportes de Descarga

Los reportes se guardan en la carpeta `data/`:
- `reporte_sii_YYYYMMDD_HHMMSS.json`: Resumen de descarga SII
- Incluye estadísticas, URLs procesadas y errores

## ⚙️ Configuración Avanzada

### Personalizar Años de Descarga

En `sii_scraper.py`, modificar la línea:

```python
# Cambiar el rango de años
self.años_descarga = list(range(2020, 2025))  # Ejemplo: 2020-2024
```

### Agregar Nuevas Leyes

En `leychile_scraper.py`, agregar a la lista `leyes_tributarias`:

```python
{
    'nombre': 'Nueva Ley',
    'numero': '12345',
    'año': '2024',
    'descripcion': 'Descripción de la ley'
}
```

### Configurar Delays

Para evitar sobrecargar los servidores:

```python
time.sleep(1)  # Pausa de 1 segundo entre descargas
```

## 🔧 Solución de Problemas

### Error de Conexión

```bash
# Verificar conectividad
ping www.sii.cl
ping www.leychile.cl
```

### Error de Dependencias

```bash
# Reinstalar dependencias
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

### Permisos de Escritura

Asegurar que el usuario tenga permisos de escritura en la carpeta del proyecto.

### Archivos Corruptos

Los scrapers verifican la integridad básica de los archivos descargados. Si hay problemas:

1. Eliminar archivos corruptos
2. Ejecutar nuevamente el scraper
3. Revisar logs para identificar problemas

## 📈 Uso para Entrenamiento de IA

### Preparación de Datos

1. **Ejecutar ambos scrapers** para obtener documentación completa
2. **Organizar por relevancia** según necesidades del modelo
3. **Procesar PDFs** si se requiere extracción de texto

### Estructura Recomendada para IA

```
training_data/
├── leyes_base/           # Leyes fundamentales
├── normativa_reciente/   # Últimas resoluciones y circulares
├── schemas_tecnicos/     # Documentación técnica
└── casos_especiales/     # Normativa específica
```

### Script de Procesamiento (Ejemplo)

```python
# Ejemplo para procesar PDFs y extraer texto
import PyPDF2
import os

def extraer_texto_pdfs(carpeta):
    textos = []
    for archivo in os.listdir(carpeta):
        if archivo.endswith('.pdf'):
            # Procesar PDF...
            pass
    return textos
```

## 🤝 Contribuciones

Para mejorar los scrapers:

1. Identificar nuevas fuentes de documentación
2. Optimizar algoritmos de descarga
3. Agregar validaciones adicionales
4. Mejorar manejo de errores

## ⚠️ Consideraciones Legales

- **Uso Responsable**: Respetar términos de servicio de los sitios web
- **Frecuencia**: No sobrecargar servidores con requests excesivos
- **Propósito**: Uso exclusivo para investigación y desarrollo de IA
- **Derechos**: Documentos públicos del Estado de Chile

## 📞 Soporte

Para problemas o mejoras:

1. Revisar logs en carpeta `logs/`
2. Verificar conectividad de red
3. Comprobar actualizaciones de dependencias
4. Documentar errores con contexto completo

## 🔄 Actualizaciones

### Mantenimiento Recomendado

- **Semanal**: Ejecutar scrapers para obtener nueva normativa
- **Mensual**: Actualizar dependencias Python
- **Trimestral**: Revisar y actualizar URLs base

### Versionado

- v1.0: Versión inicial con scrapers básicos
- Futuras versiones incluirán mejoras y nuevas fuentes

---

**Nota**: Este sistema está diseñado para recopilar documentación pública con fines de investigación y desarrollo de sistemas de IA especializados en normativa tributaria chilena.