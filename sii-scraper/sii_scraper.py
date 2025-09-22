#!/usr/bin/env python3
"""
Scraper para descargar normativa del SII (Servicio de Impuestos Internos)
Descarga resoluciones, circulares, oficios y documentos técnicos
"""

import requests
import os
import time
import logging
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
import re

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/sii_scraper.log'),
        logging.StreamHandler()
    ]
)

class SIIScraper:
    def __init__(self):
        self.base_url = "https://www.sii.cl"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # URLs base para diferentes tipos de documentos
        self.urls_base = {
            'resoluciones': 'https://www.sii.cl/normativa_legislacion/resoluciones/',
            'circulares': 'https://www.sii.cl/normativa_legislacion/circulares/',
            'oficios': 'https://www.sii.cl/normativa_legislacion/oficios/',
            'schemas': 'https://www.sii.cl/factura_electronica/formato_xml.htm'
        }
        
        # URLs específicas por año que funcionan
        self.urls_especificas = {
            'resoluciones_2024': 'https://www.sii.cl/normativa_legislacion/resoluciones/2024/res_ind2024.htm',
            'resoluciones_2023': 'https://www.sii.cl/normativa_legislacion/resoluciones/2023/res_ind2023.htm',
            'circulares_2024': 'https://www.sii.cl/normativa_legislacion/circulares/2024/indcir2024.htm',
            'circulares_2023': 'https://www.sii.cl/normativa_legislacion/circulares/2023/indcir2023.htm',
            'circulares_2025': 'https://www.sii.cl/normativa_legislacion/circulares/2025/indcir2025.htm'
        }
        
        # Años a descargar (últimos 5 años + año actual)
        año_actual = datetime.now().year
        self.años_descarga = list(range(año_actual - 4, año_actual + 1))
    
    def obtener_enlaces_documentos(self, url_indice, tipo_documento):
        """Extrae todos los enlaces a documentos PDF de una página índice"""
        try:
            logging.info(f"Obteniendo enlaces de {tipo_documento} desde: {url_indice}")
            
            response = self.session.get(url_indice)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            enlaces = []
            
            # Buscar enlaces a PDFs y documentos
            for link in soup.find_all('a', href=True):
                href = link['href']
                texto = link.get_text(strip=True)
                
                # Filtrar enlaces relevantes (PDFs, documentos, páginas de resoluciones/circulares)
                if any(ext in href.lower() for ext in ['.pdf', '.doc', '.docx']) or \
                   any(keyword in href.lower() for keyword in ['resolucion', 'circular', 'oficio', 'res_', 'cir_']):
                    
                    # Construir URL completa
                    if href.startswith('/'):
                        url_completa = urljoin(self.base_url, href)
                    elif href.startswith('http'):
                        url_completa = href
                    else:
                        url_completa = urljoin(url_indice, href)
                    
                    # Evitar duplicados y enlaces vacíos
                    if url_completa not in [e['url'] for e in enlaces] and texto:
                        enlaces.append({
                            'url': url_completa,
                            'texto': texto,
                            'href_original': href
                        })
            
            logging.info(f"Encontrados {len(enlaces)} enlaces de {tipo_documento}")
            
            # Log de algunos ejemplos para debug
            for i, enlace in enumerate(enlaces[:3]):
                logging.debug(f"Enlace {i+1}: {enlace['texto'][:50]}... -> {enlace['url']}")
            
            return enlaces
            
        except Exception as e:
            logging.error(f"Error obteniendo enlaces de {url_indice}: {str(e)}")
            return []
    
    def descargar_documento(self, enlace, carpeta_destino, tipo_documento):
        """Descarga un documento individual"""
        try:
            response = self.session.get(enlace['url'])
            response.raise_for_status()
            
            # Generar nombre de archivo
            nombre_archivo = self.generar_nombre_archivo(enlace, tipo_documento)
            ruta_archivo = os.path.join(carpeta_destino, nombre_archivo)
            
            # Evitar duplicados
            if os.path.exists(ruta_archivo):
                logging.info(f"Ya existe: {nombre_archivo}")
                return True
            
            with open(ruta_archivo, 'wb') as f:
                f.write(response.content)
            
            logging.info(f"✓ Descargado: {nombre_archivo}")
            return True
            
        except Exception as e:
            logging.error(f"Error descargando {enlace['url']}: {str(e)}")
            return False
    
    def generar_nombre_archivo(self, enlace, tipo_documento):
        """Genera un nombre de archivo limpio y descriptivo"""
        # Extraer nombre del archivo de la URL
        parsed_url = urlparse(enlace['url'])
        nombre_original = os.path.basename(parsed_url.path)
        
        if not nombre_original or not nombre_original.endswith('.pdf'):
            # Si no hay nombre o no es PDF, generar uno basado en el texto del enlace
            texto_limpio = re.sub(r'[^\w\s-]', '', enlace['texto'])
            texto_limpio = re.sub(r'\s+', '_', texto_limpio.strip())
            nombre_original = f"{tipo_documento}_{texto_limpio[:50]}.pdf"
        
        # Limpiar caracteres problemáticos
        nombre_limpio = re.sub(r'[<>:"/\\|?*]', '_', nombre_original)
        
        return nombre_limpio
    
    def descargar_resoluciones_por_año(self, año):
        """Descarga todas las resoluciones de un año específico"""
        # Usar URL específica si está disponible
        url_key = f"resoluciones_{año}"
        if url_key in self.urls_especificas:
            url_año = self.urls_especificas[url_key]
        else:
            url_año = f"{self.urls_base['resoluciones']}{año}/res_ind{año}.htm"
        
        try:
            logging.info(f"Intentando acceder a: {url_año}")
            response = self.session.get(url_año)
            if response.status_code == 404:
                logging.warning(f"No existe índice para resoluciones {año}")
                return []
            
            response.raise_for_status()
            enlaces = self.obtener_enlaces_documentos(url_año, f"resoluciones_{año}")
            
            carpeta_destino = f"resoluciones/{año}"
            os.makedirs(carpeta_destino, exist_ok=True)
            
            exitosos = 0
            for enlace in enlaces:
                if self.descargar_documento(enlace, carpeta_destino, "resolucion"):
                    exitosos += 1
                time.sleep(1)  # Pausa entre descargas
            
            logging.info(f"Resoluciones {año}: {exitosos}/{len(enlaces)} descargadas")
            return enlaces
            
        except Exception as e:
            logging.error(f"Error descargando resoluciones {año}: {str(e)}")
            return []
    
    def descargar_circulares_por_año(self, año):
        """Descarga todas las circulares de un año específico"""
        # Usar URL específica si está disponible
        url_key = f"circulares_{año}"
        if url_key in self.urls_especificas:
            url_año = self.urls_especificas[url_key]
        else:
            url_año = f"{self.urls_base['circulares']}{año}/indcir{año}.htm"
        
        try:
            logging.info(f"Intentando acceder a: {url_año}")
            response = self.session.get(url_año)
            if response.status_code == 404:
                logging.warning(f"No existe índice para circulares {año}")
                return []
            
            response.raise_for_status()
            enlaces = self.obtener_enlaces_documentos(url_año, f"circulares_{año}")
            
            carpeta_destino = f"circulares/{año}"
            os.makedirs(carpeta_destino, exist_ok=True)
            
            exitosos = 0
            for enlace in enlaces:
                if self.descargar_documento(enlace, carpeta_destino, "circular"):
                    exitosos += 1
                time.sleep(1)
            
            logging.info(f"Circulares {año}: {exitosos}/{len(enlaces)} descargadas")
            return enlaces
            
        except Exception as e:
            logging.error(f"Error descargando circulares {año}: {str(e)}")
            return []
    
    def descargar_schemas_xml(self):
        """Descarga los schemas XML de documentos electrónicos"""
        try:
            logging.info("Descargando schemas XML de documentos electrónicos")
            
            response = self.session.get(self.urls_base['schemas'])
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Buscar enlaces a archivos ZIP con schemas
            enlaces_schemas = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                if href.lower().endswith('.zip') or 'schema' in href.lower():
                    url_completa = urljoin(self.base_url, href)
                    enlaces_schemas.append({
                        'url': url_completa,
                        'texto': link.get_text(strip=True)
                    })
            
            carpeta_destino = "schemas"
            os.makedirs(carpeta_destino, exist_ok=True)
            
            exitosos = 0
            for enlace in enlaces_schemas:
                if self.descargar_documento(enlace, carpeta_destino, "schema"):
                    exitosos += 1
                time.sleep(1)
            
            logging.info(f"Schemas: {exitosos}/{len(enlaces_schemas)} descargados")
            return enlaces_schemas
            
        except Exception as e:
            logging.error(f"Error descargando schemas: {str(e)}")
            return []
    
    def ejecutar_descarga_completa(self):
        """Ejecuta la descarga completa de toda la normativa del SII"""
        logging.info("Iniciando descarga completa de normativa SII")
        
        resultados = {
            'inicio': datetime.now().isoformat(),
            'resoluciones': {},
            'circulares': {},
            'schemas': [],
            'resumen': {
                'total_documentos': 0,
                'documentos_exitosos': 0,
                'documentos_fallidos': 0
            }
        }
        
        # Descargar resoluciones por año
        for año in self.años_descarga:
            logging.info(f"Procesando resoluciones {año}")
            enlaces = self.descargar_resoluciones_por_año(año)
            resultados['resoluciones'][str(año)] = len(enlaces)
            resultados['resumen']['total_documentos'] += len(enlaces)
        
        # Descargar circulares por año
        for año in self.años_descarga:
            logging.info(f"Procesando circulares {año}")
            enlaces = self.descargar_circulares_por_año(año)
            resultados['circulares'][str(año)] = len(enlaces)
            resultados['resumen']['total_documentos'] += len(enlaces)
        
        # Descargar schemas XML
        logging.info("Procesando schemas XML")
        schemas = self.descargar_schemas_xml()
        resultados['schemas'] = len(schemas)
        resultados['resumen']['total_documentos'] += len(schemas)
        
        # Guardar reporte
        resultados['fin'] = datetime.now().isoformat()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        reporte_file = f"data/reporte_sii_{timestamp}.json"
        
        with open(reporte_file, 'w', encoding='utf-8') as f:
            json.dump(resultados, f, indent=2, ensure_ascii=False)
        
        logging.info(f"Descarga SII completada. Reporte: {reporte_file}")
        return resultados

def main():
    """Función principal"""
    print("🏛️  Scraper de Normativa SII")
    print("=" * 40)
    
    # Crear directorios
    for carpeta in ['resoluciones', 'circulares', 'oficios', 'schemas', 'data', 'logs']:
        os.makedirs(carpeta, exist_ok=True)
    
    scraper = SIIScraper()
    resultados = scraper.ejecutar_descarga_completa()
    
    print(f"\n📊 Resumen de descarga:")
    print(f"📄 Total documentos procesados: {resultados['resumen']['total_documentos']}")
    print(f"📁 Resoluciones por año: {resultados['resoluciones']}")
    print(f"📁 Circulares por año: {resultados['circulares']}")
    print(f"📁 Schemas XML: {resultados['schemas']}")

if __name__ == "__main__":
    main()