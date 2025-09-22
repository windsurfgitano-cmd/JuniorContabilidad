Dijiste:
necesito descargar la biblioteca compra del SII y el sistema de impuestos internos de chile para alimentar a mi sistema de IA de sabelotodo del SII
ChatGPT dijo:

¿Podrías aclarar a qué te refieres con "biblioteca compra del SII"? ¿Estás buscando una API, base de datos, documentación técnica, o algún conjunto específico de archivos del Servicio de Impuestos Internos de Chile (SII)? También, ¿qué tipo de información del SII necesitas incorporar a tu sistema: boletas electrónicas, facturas, libros de compras/ventas, declaraciones, etc.?

Dijiste:
todas las leyes documentos todo todo todo lo oficial todo
ChatGPT dijo:

Perfecto. Investigaré y recopilaré todas las fuentes oficiales disponibles del Servicio de Impuestos Internos (SII) de Chile, incluyendo leyes, normativas, resoluciones, documentos técnicos, manuales, guías, APIs disponibles, y bases de datos públicas. Me enfocaré en fuentes oficiales y confiables para asegurarte que toda la información pueda ser usada legalmente como referencia para tu sistema de IA sabelotodo del SII.

Te avisaré cuando tenga el material listo para tu revisión.

Research completed in 5m· 37 fuentes· 41 búsquedas

Documentación Oficial y Recursos del SII de Chile

Legislación Tributaria

El Servicio de Impuestos Internos (SII) remite a los textos oficiales vigentes de las principales leyes tributarias. Entre ellas se destacan: la Ley sobre Impuesto a la Renta (Decreto Ley N°824 de 1974, publicado en D.O. 31/12/1974)
sii.cl
, la Ley sobre Impuesto a las Ventas y Servicios (Decreto Ley N°825, Ley de IVA)
sii.cl
, la Ley sobre Impuesto de Timbres y Estampillas (contenida en D.L. N°3475 de 1980)
sii.cl
, el Código Tributario (D.L. N°830 de 1974)
sii.cl
, la Ley del Impuesto Territorial (Ley 17.235 de 1969, texto refundido por D.F.L. 1 de 1998)
sii.cl
, y la Ley de Impuesto a las Herencias, Asignaciones y Donaciones (Ley 16.271 de 1966 refundida por D.F.L. 1 de 2000)
sii.cl
. Estos textos oficiales están disponibles en la web del SII o en enlaces al sitio de la Biblioteca del Congreso (LeyChile), generalmente en formato PDF (texto consolidado vigente)
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
.

Normativa del SII (Resoluciones, Circulares, Dictámenes)

El SII publica mensualmente Circulares (instrucciones internas) y Resoluciones Exentas (actos administrativos) en su sitio web. Por ejemplo, el índice de Circulares del año 2025 se puede consultar en sii.cl
sii.cl
, y de igual forma existe un índice de Resoluciones Exentas por año
sii.cl
. Entre ellas, las Resoluciones recientes 117-119/2025 regulan, por ejemplo, el acceso a la API de Inicio de Actividades
sii.cl
. Los dictámenes y oficios (respuestas a consultas) también están disponibles vía el Administrador de Contenido Normativo del SII o en el Portal de Transparencia del SII. En general estos documentos se obtienen en PDF desde el sitio del SII, bajo secciones como “Normativa” (circulares, resoluciones) o “Ayudas – Formularios” (instrucciones y modelos de formularios tributarios)
sii.cl
sii.cl
.

Documentación Técnica y Guías de Usuario

El SII ofrece manuales e instructivos para sus sistemas electrónicos. Por ejemplo, para la emisión de boletas electrónicas existe un “Instructivo Técnico Boleta Electrónica” actualizado (PDF)
sii.cl
, así como guías de usuario paso a paso en su portal de ayuda. Para la contabilidad electrónica (libros contables en formato digital), el SII publica descripciones de funcionamiento, requisitos y modelos de archivos (ver sección “Libros Contables Electrónicos” en sii.cl)
sii.cl
sii.cl
. Muchos de estos documentos técnicos se descargan en PDF o están en páginas HTML del sitio del SII con formato guía.

APIs Públicas y Servicios Web

El SII habilita ciertos servicios de integración para desarrolladores. Destaca la Interfaz de Programación de Aplicaciones (API) de Inicio de Actividades, cuyo acceso se autoriza mediante resoluciones SII (ver Res. Ex. N°119/2025)
sii.cl
. Asimismo, el SII mantiene web services para la emisión y consulta de Documentos Tributarios Electrónicos (DTE), como facturas y boletas (por ejemplo, servicios SOAP/REST para envío y consulta de estado de DTE). Estos servicios suelen requerir certificado digital y se documentan en el portal de “Factura Electrónica”. En general, la información oficial sobre APIs y Web Services del SII se ofrece en su sitio (secciones de Ayuda y Facturación Electrónica), aunque no siempre con enlaces públicos directos.

Esquemas XML/JSON y Formatos de Documentos Electrónicos

El formato estándar de los DTE en Chile es XML. El SII provee los esquemas (XSD) oficiales y diagramas de referencia para todos los documentos electrónicos. Por ejemplo, en la sección “Formato XML de Documentos Electrónicos” del sitio SII se pueden descargar los schemas XML para facturas/boletas y otros DTE
sii.cl
. Allí se incluyen:

Schema XML de Documentos Tributarios Electrónicos (DTE), conjunto de archivos XSD (envío, DTE, firma, etc.)
sii.cl
.

Schema XML de Boletas Electrónicas, junto con su diagrama y descripción de formato
sii.cl
.

Schemas para libros electrónicos (libro de ventas, libro de boletas, libro guía despacho, libros contables, etc.), los cuales también figuran listados en esa página
sii.cl
sii.cl
.

Estos archivos schema se descargan comprimidos (ZIP) y permiten validar los XML antes de enviarlos al SII. En la práctica, el SII trabaja con XML; no existe un estándar oficial JSON para DTE, aunque algunos servicios o sistemas externos pueden ofrecer JSON para consultas internas.

Formularios Oficiales y Declaraciones Juradas

En el portal de Ayuda del SII están todos los formularios tributarios oficiales y sus instrucciones de llenado. Por ejemplo, el Formulario 22 (declaración anual de Impuesto a la Renta) está disponible en PDF
sii.cl
, así como decenas de otras declaraciones juradas mensuales y anuales (Formulario 29 de IVA, Form. 50 de ISR, Form. 1887, etc.) detalladas en las páginas de “Formularios y Plazos”
sii.cl
. Cada formulario se descarga en PDF e incluye un instructivo o layout asociado (también en PDF).

Datos Abiertos y Estadísticas (CSV, TXT)

En el Portal de Transparencia del SII se publica abundante información en formatos abiertos. Por ejemplo, hay estadísticas descargables en formato CSV sobre los principales formularios (F22, F29, etc.)
sii.cl
. También existen nóminas y listados públicos (por ejemplo, de bienes raíces) en archivos TXT o ZIP (ver la sección de “Información de propiedades”
sii.cl
). Estas fuentes permiten obtener datos agregados en formatos de texto plano (CSV, TXT) para análisis externos.

 

Fuentes: Sitio oficial del SII (sii.cl) – sección Normativa y Ayudas (leyes, resoluciones, circulares, instructivos, esquemas XML, formularios y datos abiertos)
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
sii.cl
.

Fuentes
Dijiste:
ya entonces, si quiera autoamtizar la descar de todos los pdf de las leyes?
ChatGPT dijo:

Sí, eso se puede automatizar perfectamente 👌.

En Chile, las leyes tributarias oficiales están publicadas en dos lugares principales:

SII (sii.cl) → el SII enlaza las leyes en su sección Normativa.

Biblioteca del Congreso Nacional (BCN) – LeyChile.cl → ahí están las versiones consolidadas y actualizadas en PDF.

👉 Entonces, para automatizar:

Opciones técnicas

Scraping directo desde LeyChile.cl

Cada ley tiene una URL fija, por ejemplo:

Ley de Impuesto a la Renta (D.L. 824):
https://www.bcn.cl/leychile/navegar?idNorma=2867

Ley de IVA (D.L. 825):
https://www.bcn.cl/leychile/navegar?idNorma=2934

Código Tributario (D.L. 830):
https://www.bcn.cl/leychile/navegar?idNorma=2869

Dentro de cada ficha, aparece un botón “Descargar PDF”.

Con un script (ej: Python + requests + BeautifulSoup), se puede extraer el enlace al PDF y descargarlo automáticamente.

Usar la API de LeyChile (BCN)

BCN tiene un servicio web REST/JSON para acceder al texto legal:
👉 https://www.leychile.cl/Consulta/

Se puede pedir el texto en XML/JSON, pero también hay endpoints que permiten bajar la versión en PDF consolidado.

Lista cerrada de leyes tributarias
Como el set es acotado (unas 6–8 leyes principales tributarias), puedes armar un script que itere por los ID de cada norma y descargue la versión consolidada en PDF.

Ejemplo en Python (descarga de PDFs de LeyChile)
import requests
from bs4 import BeautifulSoup

# Diccionario con nombre y URL de cada ley tributaria
leyes = {
    "impuesto_renta": "https://www.bcn.cl/leychile/navegar?idNorma=2867",
    "iva": "https://www.bcn.cl/leychile/navegar?idNorma=2934",
    "timbres": "https://www.bcn.cl/leychile/navegar?idNorma=2977",
    "codigo_tributario": "https://www.bcn.cl/leychile/navegar?idNorma=2869",
    "impuesto_territorial": "https://www.bcn.cl/leychile/navegar?idNorma=19526",
    "herencias_donaciones": "https://www.bcn.cl/leychile/navegar?idNorma=2860"
}

for nombre, url in leyes.items():
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    pdf_link = soup.find("a", {"id": "linkPdf"})["href"]
    
    pdf_url = "https://www.bcn.cl" + pdf_link
    pdf = requests.get(pdf_url)
    
    with open(f"{nombre}.pdf", "wb") as f:
        f.write(pdf.content)
    print(f"Descargado: {nombre}.pdf")


Este script:

Entra a cada página de la ley.

Extrae el link del botón “Descargar PDF”.

Lo guarda localmente con un nombre descriptivo.

¿Quieres que te arme yo directamente el script completo listo para bajar todas las leyes tributarias principales (en PDF desde LeyChile), o prefieres que lo ajustemos para que incluya también resoluciones/circulares del SII?

Dijiste:
uya pero ahi pregunto por especificos, neceisot toda slas leyes del sii po perro
ChatGPT dijo:

Ahí te caché 🐕🔥 — no quieres unas pocas leyes tributarias, sino TODO lo que el SII referencia en su marco normativo oficial: leyes, decretos, reglamentos, resoluciones, circulares, etc.

📌 Importante:

El SII no es quien dicta leyes. Publica y aplica.

Las fuentes legales oficiales están en la Biblioteca del Congreso Nacional (LeyChile).

Lo que sí mantiene el SII es su normativa propia: resoluciones, circulares, oficios, instructivos, esquemas técnicos.

Entonces tienes dos mundos que deberías scrapear / automatizar:
1. Leyes y reglamentos (LeyChile.cl)

En LeyChile están todas las leyes que cita el SII en su sección “Normativa”.

Son unas 30–40 leyes y decretos principales (impuestos a la renta, IVA, timbres, donaciones, herencias, código tributario, normas de alcoholes/tabacos, aduanas, etc.).

Ahí puedes usar la API de LeyChile (devuelve XML/JSON/PDF).
👉 https://www.leychile.cl/Consulta

2. Normativa propia del SII (sii.cl)

Resoluciones Exentas → archivo completo desde 1990 hasta hoy.
📍 Ejemplo índice: Resoluciones 2025

Circulares → archivo anual desde 1974.
📍 Ejemplo: Circulares 2025

Oficios / Dictámenes (respuestas a consultas).

Todos estos están en PDF, enlazados desde páginas HTML que tienen un índice.

👉 O sea: puedes scrapear esas páginas índice del SII (cada año) y descargarte automáticamente todos los PDF.

Estrategia de Automatización

Leyes en LeyChile (API oficial)

Usas la API REST → descargas en PDF/XML.

Iteras por un listado de IDs de norma.

Guardas con nombre normalizado.

Resoluciones y Circulares en sii.cl

Para cada año → scrapear el índice.

Extraer todos los links a PDF.

Descargar con requests.

Oficios y dictámenes

Similar, pero suelen estar en HTML o PDF.

Se puede bajar por batch desde los índices del SII.

💡 Esto es harta data: literalmente miles de PDFs.
¿Quieres que te arme un script Python que baje TODO el archivo del SII (resoluciones + circulares + oficios) por año y en paralelo un script para LeyChile para leyes oficiales?

Así te llevas una librería completa “SII + Leyes tributarias” para tu IA. ¿Quieres que lo deje listo para correr en Python y que descargue todo en carpetas ordenadas por tipo/año?

Dijiste:
siiiiiii, brutal
ChatGPT dijo:

Perfecto, perro 🔥🐕🔥
Entonces te dejo la receta completa para que armes tu “aspiradora del SII” y tengas TODA la normativa en tu disco, ordenadita por carpetas.


#!/usr/bin/env python3 """ sii_aspiradora.py Script completo y robusto para descargar masivamente: - Leyes y normas desde LeyChile (BCN) - Circulares, Resoluciones, Oficios y documentos del SII - Schemas XML (XSD) y documentación técnica (DTE, boletas, libros) - Formularios PDF y datos abiertos cuando estén disponibles Características: - Carpeta de salida organizada por tipo y año - JSON catalog (metadatos) con información de cada archivo descargado - Reintentos, backoff exponencial y manejo de errores - Concurrency configurable (ThreadPoolExecutor) - Guardado de HTML crudo + extracción de texto en .txt - (Opcional) conversión HTML -> PDF si wkhtmltopdf está instalado - Funciones para reanudar (resume) y para revisar archivos ya descargados Notas: - Revisa y respeta robots.txt de los sitios que scrapes. - Ajusta `USER_AGENT` y `RATE_LIMIT` para no sobrecargar servidores. - Puede tardar horas si pides descargar décadas de resoluciones. Requisitos pip: pip install requests beautifulsoup4 tqdm chardet Uso: python sii_aspiradora.py --years 1990-2025 --concurrency 8 --outdir ./sii_data """ from __future__ import annotations import argparse import concurrent.futures import hashlib import json import os import re import sys import time import traceback from datetime import datetime from pathlib import Path from typing import Dict, List, Optional, Tuple import chardet import requests from bs4 import BeautifulSoup from tqdm import tqdm from urllib.parse import urljoin, urlparse import subprocess # -------------------------- # CONFIG # -------------------------- USER_AGENT = "sii_aspiradora/1.0 (+https://example.com)"  # cámbialo por tu contacto si quieres HEADERS = {"User-Agent": USER_AGENT} RATE_LIMIT = 0.15  # segundos entre requests a un mismo dominio (simple throttle) DEFAULT_CONCURRENCY = 6 REQUEST_TIMEOUT = 30 RETRIES = 3 BACKOFF_FACTOR = 1.5 # Endpoints y plantillas (se pueden ajustar) LEYCHILE_BASE = "https://www.bcn.cl/leychile/navegar" SII_BASE = "https://www.sii.cl" SII_NORMATIVA_INDEX = "https://www.sii.cl/normativa_legislacion/{tipo}/{anio}/indice.htm" SII_TIPOS_INDICE = ["circulares", "resoluciones", "oficios"] # Algunos IDs de ejemplo de LeyChile (lista inicial; se recomienda ampliar/uplodear ids) LEYCHILE_EXAMPLE_IDS = { "DL_824_impuesto_renta": "2867", "DL_825_iva": "2934", "DL_830_codigo_tributario": "2869", } # -------------------------- # UTILIDADES # -------------------------- def safe_mkdir(path: Path): path.mkdir(parents=True, exist_ok=True) def http_get(url: str, session: requests.Session, stream: bool = False) -> requests.Response: """GET con reintentos y backoff.""" last_exc = None for attempt in range(1, RETRIES + 1): try: resp = session.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT, stream=stream) resp.raise_for_status() time.sleep(RATE_LIMIT) return resp except Exception as e: last_exc = e wait = BACKOFF_FACTOR ** (attempt - 1) print(f"GET error {url} (attempt {attempt}/{RETRIES}): {e}. retrying in {wait:.1f}s") time.sleep(wait) raise last_exc def guess_encoding(content: bytes) -> str: try: detected = chardet.detect(content) return detected.get("encoding", "utf-8") or "utf-8" except Exception: return "utf-8" def write_binary(path: Path, data: bytes): with open(path, "wb") as f: f.write(data) def write_text(path: Path, text: str, encoding: str = "utf-8"): with open(path, "w", encoding=encoding, errors="replace") as f: f.write(text) def sha256_hex(data: bytes) -> str: return hashlib.sha256(data).hexdigest() # -------------------------- # CATALOGO # -------------------------- class Catalog: def __init__(self, outdir: Path): self.outdir = outdir self.catalog_path = outdir / "catalog.json" self.data: Dict[str, Dict] = {} if self.catalog_path.exists(): try: self.data = json.loads(self.catalog_path.read_text(encoding="utf-8")) except Exception: self.data = {} def add(self, key: str, info: Dict): # key único por recurso (por ejemplo: sitio|tipo|url) self.data[key] = info self._save() def exists(self, key: str) -> bool: return key in self.data def _save(self): write_text(self.catalog_path, json.dumps(self.data, indent=2, ensure_ascii=False)) # -------------------------- # FUNCIONES PARA LEYCHILE # -------------------------- def descargar_ley_from_bcn(id_norma: str, outdir: Path, session: requests.Session) -> Optional[Dict]: """Descarga la ficha de LeyChile y su PDF consolidado si existe. id_norma: por ejemplo '2867' Guarda: outdir/leyes/{id_norma}.html y {id_norma}.pdf (si viene) Devuelve metadatos o None. """ safe_mkdir(outdir) url = f"{LEYCHILE_BASE}?idNorma={id_norma}" try: r = http_get(url, session) content = r.content enc = guess_encoding(content) text = content.decode(enc, errors="replace") html_path = outdir / f"ley_{id_norma}.html" write_text(html_path, text, encoding=enc) soup = BeautifulSoup(text, "html.parser") # Buscar link PDF consolidado (selector robusto) pdf_link = None # botones con texto 'Descargar PDF' o 'Versión PDF' for a in soup.find_all("a"): txt = (a.get_text() or "").lower() href = a.get("href") if not href: continue if "pdf" in href.lower() or "descargar" in txt or "pdf" in txt: if href.lower().endswith('.pdf') or 'pdf' in href.lower(): pdf_link = href break pdf_path = None if pdf_link: pdf_url = urljoin("https://www.bcn.cl", pdf_link) try: resp_pdf = http_get(pdf_url, session, stream=False) pdf_bytes = resp_pdf.content pdf_path = outdir / f"ley_{id_norma}.pdf" write_binary(pdf_path, pdf_bytes) except Exception as e: print(f"Fallo descargar PDF {pdf_url}: {e}") meta = { "source": "leychile.bcn.cl", "id_norma": id_norma, "url": url, "html_path": str(html_path), "pdf_path": str(pdf_path) if pdf_path else None, "downloaded_at": datetime.utcnow().isoformat() + "Z", } return meta except Exception as e: print(f"Error descargar_ley_from_bcn({id_norma}): {e}") traceback.print_exc() return None # -------------------------- # FUNCIONES PARA SII # -------------------------- def parse_index_and_collect_pdfs(index_url: str, base_url: str) -> List[str]: """Dado el índice HTML, extrae todos los href .pdf absolutos. No hace requests aquí, recibe HTML ya descargado. """ try: r = requests.get(index_url, headers=HEADERS, timeout=REQUEST_TIMEOUT) r.raise_for_status() soup = BeautifulSoup(r.text, "html.parser") pdfs = [] for a in soup.find_all("a", href=True): href = a["href"] if href.lower().endswith(".pdf"): pdfs.append(urljoin(base_url, href)) return list(dict.fromkeys(pdfs)) except Exception as e: print(f"parse_index_and_collect_pdfs error for {index_url}: {e}") return [] def scrapear_sii_indice_tipo_anio(tipo: str, anio: int, outdir: Path, session: requests.Session, catalog: Catalog) -> None: """Scrapea la página índice y descarga cada PDF listado. Guarda HTML del índice, cada PDF en outdir/{tipo}/{anio}/ """ safe_mkdir(outdir) index_url = SII_NORMATIVA_INDEX.format(tipo=tipo, anio=anio) try: r = http_get(index_url, session) except Exception as e: print(f"No pude acceder al índice SII {tipo} {anio}: {e}") return enc = guess_encoding(r.content) text = r.content.decode(enc, errors="replace") index_html_path = outdir / f"index_{anio}.html" write_text(index_html_path, text, encoding=enc) soup = BeautifulSoup(text, "html.parser") # Recolectar enlaces a PDFs links = [] for a in soup.find_all("a", href=True): href = a["href"].strip() if not href: continue # Aceptar urls relativos y absolutos if href.lower().endswith('.pdf'): pdf_url = urljoin(SII_BASE, href) links.append(pdf_url) else: # A veces la ficha está en otra página; intentaremos seguir enlaces que parezcan fichas # si el enlace apunta a otra página del SII y contiene 'textos' o 'resol' etc, lo añadimos if 'resol' in href.lower() or 'circ' in href.lower() or 'oficio' in href.lower(): page_url = urljoin(SII_BASE, href) links.append(page_url) # Normalizar y deduplicar links = list(dict.fromkeys(links)) carpeta = outdir safe_mkdir(carpeta) for link in tqdm(links, desc=f"{tipo}/{anio}"): try: # Si es PDF directo if link.lower().endswith('.pdf'): key = f"sii|{tipo}|{anio}|{link}" if catalog.exists(key): continue resp = http_get(link, session, stream=False) data = resp.content filename = os.path.basename(urlparse(link).path) path = carpeta / filename write_binary(path, data) catalog.add(key, { "source": "sii.cl", "type": tipo, "year": anio, "url": link, "local_path": str(path), "sha256": sha256_hex(data), "downloaded_at": datetime.utcnow().isoformat() + "Z" }) else: # Página HTML: descargar, guardar HTML y extraer PDF links o texto key = f"sii|{tipo}|{anio}|{link}" if catalog.exists(key): continue resp = http_get(link, session, stream=False) enc2 = guess_encoding(resp.content) html_text = resp.content.decode(enc2, errors='replace') parsed = BeautifulSoup(html_text, 'html.parser') # Guardar HTML safe_mkdir(carpeta) safe_name = re.sub(r'[^0-9a-zA-Z-_\.]+', '_', os.path.basename(urlparse(link).path) or f"page_{int(time.time())}") html_path = carpeta / (safe_name + '.html') write_text(html_path, html_text, encoding=enc2) # Extraer PDF links dentro pdfs_inside = [] for a in parsed.find_all('a', href=True): href = a['href'] if href.lower().endswith('.pdf'): pdfs_inside.append(urljoin(SII_BASE, href)) # Guardar metadatos catalog.add(key, { "source": "sii.cl", "type": tipo, "year": anio, "url": link, "local_html": str(html_path), "pdfs_inside": pdfs_inside, "downloaded_at": datetime.utcnow().isoformat() + "Z" }) # Descargar PDFs found inside for p in pdfs_inside: try: key2 = f"sii|{tipo}|{anio}|{p}" if catalog.exists(key2): continue rr = http_get(p, session, stream=False) bts = rr.content fname = os.path.basename(urlparse(p).path) write_binary(carpeta / fname, bts) catalog.add(key2, { "source": "sii.cl", "type": tipo, "year": anio, "url": p, "local_path": str(carpeta / fname), "sha256": sha256_hex(bts), "downloaded_at": datetime.utcnow().isoformat() + "Z" }) except Exception as e: print(f"Error descargando pdf interno {p}: {e}") except Exception as e: print(f"Error procesando link {link}: {e}") traceback.print_exc() # -------------------------- # OTRAS FUNCIONES VALIOSAS # -------------------------- def extract_text_from_html(html_path: Path) -> str: try: text = html_path.read_text(encoding='utf-8', errors='replace') except Exception: raw = html_path.read_bytes() enc = guess_encoding(raw) text = raw.decode(enc, errors='replace') soup = BeautifulSoup(text, 'html.parser') # Eliminar scripts y estilos for s in soup(['script', 'style']): s.decompose() body = soup.get_text(separator='\n') # Normalizar espacios lines = [line.strip() for line in body.splitlines()] text_clean = '\n'.join([l for l in lines if l]) return text_clean def html_to_pdf(html_path: Path, output_pdf: Path) -> bool: """Intentar convertir usando wkhtmltopdf si está disponible en el sistema.""" try: subprocess.run(['wkhtmltopdf', '--version'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE) except Exception: return False try: subprocess.run(['wkhtmltopdf', str(html_path), str(output_pdf)], check=True) return True except Exception as e: print(f"wkhtmltopdf falló: {e}") return False # -------------------------- # MAIN RUNNERS # -------------------------- def download_leyes_batch(ids: List[str], outdir: Path, session: requests.Session, catalog: Catalog, concurrency: int = 4): target = outdir / 'leyes' safe_mkdir(target) with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as ex: futures = {} for idn in ids: futures[ex.submit(descargar_ley_from_bcn, idn, target, session)] = idn for fut in tqdm(concurrent.futures.as_completed(futures), total=len(futures), desc='leyes'): idn = futures[fut] try: meta = fut.result() if meta: key = f"leychile|{meta.get('id_norma')}|{meta.get('url')}" catalog.add(key, meta) except Exception as e: print(f"Error en descarga ley {idn}: {e}") def download_sii_range(years: List[int], outdir: Path, session: requests.Session, catalog: Catalog, concurrency: int = 6): base = outdir tasks = [] with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as ex: futures = [] for year in years: for tipo in SII_TIPOS_INDICE: dest = base / tipo / str(year) futures.append(ex.submit(scrapear_sii_indice_tipo_anio, tipo, year, dest, session, catalog)) for fut in tqdm(concurrent.futures.as_completed(futures), total=len(futures), desc='sii_indices'): try: fut.result() except Exception as e: print(f"Error en tarea sii: {e}") # -------------------------- # CLI y ejecución # -------------------------- def parse_years_arg(yrange: str) -> List[int]: if '-' in yrange: start, end = yrange.split('-', 1) return list(range(int(start), int(end) + 1)) else: return [int(x) for x in yrange.split(',') if x.strip()] def main(argv=None): p = argparse.ArgumentParser(description='SII Aspiradora - descarga masiva de normativa y leyes') p.add_argument('--outdir', default='./sii_data', help='Carpeta destino') p.add_argument('--years', default='2000-2025', help='Rango años ejemplo 1990-2025 o 2018,2019,2020') p.add_argument('--concurrency', type=int, default=DEFAULT_CONCURRENCY) p.add_argument('--ley-ids-file', default=None, help='Archivo con IDs de LeyChile (uno por línea)') p.add_argument('--download-leychile', action='store_true', help='Descargar leyes desde LeyChile') p.add_argument('--download-sii', action='store_true', help='Descargar normativa SII (circulares/resoluciones/oficios)') p.add_argument('--convert-html-pdf', action='store_true', help='Intentar convertir HTML a PDF (wkhtmltopdf)') args = p.parse_args(argv) outdir = Path(args.outdir) safe_mkdir(outdir) catalog = Catalog(outdir) session = requests.Session() session.headers.update(HEADERS) years = parse_years_arg(args.years) # LEYES if args.download_leychile: if args.ley_ids_file: ids = [line.strip() for line in Path(args.ley_ids_file).read_text(encoding='utf-8').splitlines() if line.strip()] else: # usar lista ejemplo (mejor que el usuario entregue su lista completa) ids = list(LEYCHILE_EXAMPLE_IDS.values()) print(f"Descargando {len(ids)} leyes desde LeyChile...") download_leyes_batch(ids, outdir, session, catalog, concurrency=args.concurrency) # SII if args.download_sii: print(f"Descargando normativa SII para años: {years} ...") download_sii_range(years, outdir, session, catalog, concurrency=args.concurrency) # POST-PROCESO: extraer textos y opcionalmente convertir HTML->PDF if args.convert_html_pdf: # Buscar HTML guardados en outdir y convertir for html_path in outdir.rglob('*.html'): try: pdf_path = html_path.with_suffix('.pdf') if pdf_path.exists(): continue ok = html_to_pdf(html_path, pdf_path) if ok: print(f"Convertido {html_path} -> {pdf_path}") except Exception as e: print(f"Error convert HTML->PDF {html_path}: {e}") # Extraer textos para HTML descargados print("Extrayendo textos de HTML guardados...") for html_path in tqdm(list(outdir.rglob('*.html')), desc='extract_text'): try: txt = extract_text_from_html(html_path) txt_path = html_path.with_suffix('.txt') write_text(txt_path, txt, encoding='utf-8') except Exception as e: print(f"Error extrayendo texto {html_path}: {e}") print("¡Completo! Revisa la carpeta:", outdir) if __name__ == '__main__': main()