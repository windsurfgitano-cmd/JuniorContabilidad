#!/usr/bin/env python3
"""
Scraper para descargar leyes tributarias desde LeyChile.cl
Descarga automáticamente todas las leyes referenciadas por el SII
"""

import requests
import os
import time
import logging
from datetime import datetime
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/leychile_scraper.log'),
        logging.StreamHandler()
    ]
)

class LeyChileScraper:
    def __init__(self):
        self.base_url = "https://www.bcn.cl"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Leyes tributarias principales referenciadas por el SII
        self.leyes_tributarias = {
            "DL_824_Impuesto_Renta": {
                "id": "2867",
                "nombre": "Decreto Ley 824 - Ley de Impuesto a la Renta",
                "url": "https://www.bcn.cl/leychile/navegar?idNorma=2867"
            },
            "DL_825_IVA": {
                "id": "2934", 
                "nombre": "Decreto Ley 825 - Ley de IVA",
                "url": "https://www.bcn.cl/leychile/navegar?idNorma=2934"
            },
            "DL_830_Codigo_Tributario": {
                "id": "2869",
                "nombre": "Decreto Ley 830 - Código Tributario", 
                "url": "https://www.bcn.cl/leychile/navegar?idNorma=2869"
            },
            "DL_3475_Timbres_Estampillas": {
                "id": "2977",
                "nombre": "Decreto Ley 3475 - Ley de Timbres y Estampillas",
                "url": "https://www.bcn.cl/leychile/navegar?idNorma=2977"
            },
            "Ley_17235_Impuesto_Territorial": {
                "id": "19526",
                "nombre": "Ley 17.235 - Impuesto Territorial",
                "url": "https://www.bcn.cl/leychile/navegar?idNorma=19526"
            },
            "Ley_16271_Herencias_Donaciones": {
                "id": "2860",
                "nombre": "Ley 16.271 - Impuesto Herencias y Donaciones",
                "url": "https://www.bcn.cl/leychile/navegar?idNorma=2860"
            },
            "Ley_18211_Alcoholes": {
                "id": "29473",
                "nombre": "Ley 18.211 - Impuesto a Bebidas Alcohólicas",
                "url": "https://www.bcn.cl/leychile/navegar?idNorma=29473"
            },
            "Ley_19995_Casinos": {
                "id": "213717",
                "nombre": "Ley 19.995 - Casinos de Juego",
                "url": "https://www.bcn.cl/leychile/navegar?idNorma=213717"
            },
            "DFL_7_Aduanas": {
                "id": "236894",
                "nombre": "DFL 7 - Ordenanza de Aduanas",
                "url": "https://www.bcn.cl/leychile/navegar?idNorma=236894"
            }
        }
    
    def descargar_pdf_ley(self, ley_info):
        """Descarga el PDF de una ley específica"""
        try:
            logging.info(f"Descargando: {ley_info['nombre']}")
            
            # Obtener la página de la ley
            response = self.session.get(ley_info['url'])
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Buscar el enlace al PDF
            pdf_link = None
            
            # Buscar diferentes patrones de enlaces PDF
            for link in soup.find_all('a', href=True):
                href = link['href']
                if 'pdf' in href.lower() or 'descargar' in link.text.lower():
                    pdf_link = href
                    break
            
            # Si no encuentra enlace directo, buscar por ID común
            if not pdf_link:
                pdf_element = soup.find('a', {'id': 'linkPdf'})
                if pdf_element:
                    pdf_link = pdf_element['href']
            
            if not pdf_link:
                logging.warning(f"No se encontró enlace PDF para {ley_info['nombre']}")
                return False
            
            # Construir URL completa del PDF
            if pdf_link.startswith('/'):
                pdf_url = urljoin(self.base_url, pdf_link)
            else:
                pdf_url = pdf_link
            
            # Descargar el PDF
            pdf_response = self.session.get(pdf_url)
            pdf_response.raise_for_status()
            
            # Guardar el archivo
            filename = f"leyes/{ley_info['id']}_{ley_info['nombre'].replace(' ', '_').replace('-', '_')}.pdf"
            filename = filename.replace('/', '_').replace('\\', '_')  # Limpiar caracteres problemáticos
            
            with open(filename, 'wb') as f:
                f.write(pdf_response.content)
            
            logging.info(f"✓ Descargado: {filename}")
            return True
            
        except Exception as e:
            logging.error(f"Error descargando {ley_info['nombre']}: {str(e)}")
            return False
    
    def descargar_todas_las_leyes(self):
        """Descarga todas las leyes tributarias"""
        logging.info("Iniciando descarga de leyes tributarias desde LeyChile.cl")
        
        resultados = {
            'exitosas': 0,
            'fallidas': 0,
            'total': len(self.leyes_tributarias),
            'detalles': []
        }
        
        for codigo, ley_info in self.leyes_tributarias.items():
            try:
                exito = self.descargar_pdf_ley(ley_info)
                
                if exito:
                    resultados['exitosas'] += 1
                    resultados['detalles'].append({
                        'codigo': codigo,
                        'nombre': ley_info['nombre'],
                        'estado': 'exitoso'
                    })
                else:
                    resultados['fallidas'] += 1
                    resultados['detalles'].append({
                        'codigo': codigo,
                        'nombre': ley_info['nombre'],
                        'estado': 'fallido'
                    })
                
                # Pausa entre descargas para no sobrecargar el servidor
                time.sleep(2)
                
            except Exception as e:
                logging.error(f"Error procesando {codigo}: {str(e)}")
                resultados['fallidas'] += 1
                resultados['detalles'].append({
                    'codigo': codigo,
                    'nombre': ley_info['nombre'],
                    'estado': 'error',
                    'error': str(e)
                })
        
        # Guardar reporte de resultados
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        reporte_file = f"data/reporte_leyes_{timestamp}.json"
        
        with open(reporte_file, 'w', encoding='utf-8') as f:
            json.dump(resultados, f, indent=2, ensure_ascii=False)
        
        logging.info(f"Descarga completada: {resultados['exitosas']}/{resultados['total']} exitosas")
        logging.info(f"Reporte guardado en: {reporte_file}")
        
        return resultados

def main():
    """Función principal"""
    print("🏛️  Scraper de Leyes Tributarias - LeyChile.cl")
    print("=" * 50)
    
    # Crear directorios si no existen
    os.makedirs('leyes', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    scraper = LeyChileScraper()
    resultados = scraper.descargar_todas_las_leyes()
    
    print(f"\n📊 Resumen:")
    print(f"✅ Exitosas: {resultados['exitosas']}")
    print(f"❌ Fallidas: {resultados['fallidas']}")
    print(f"📁 Total: {resultados['total']}")
    
    if resultados['fallidas'] > 0:
        print(f"\n⚠️  Revisa el log para detalles de las descargas fallidas")

if __name__ == "__main__":
    main()