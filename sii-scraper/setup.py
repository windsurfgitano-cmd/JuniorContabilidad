#!/usr/bin/env python3
"""
Script de configuración inicial para SII Scraper
Verifica dependencias, crea estructura de carpetas y ejecuta tests básicos
"""

import os
import sys
import subprocess
import importlib
import json
from datetime import datetime

def verificar_python():
    """Verifica que la versión de Python sea compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Error: Se requiere Python 3.8 o superior")
        print(f"   Versión actual: {version.major}.{version.minor}.{version.micro}")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
    return True

def verificar_dependencias():
    """Verifica que todas las dependencias estén instaladas"""
    dependencias_requeridas = [
        'requests',
        'bs4',  # beautifulsoup4
        'lxml',
        'urllib3'
    ]
    
    dependencias_faltantes = []
    
    for dep in dependencias_requeridas:
        try:
            importlib.import_module(dep)
            print(f"✅ {dep} - Instalado")
        except ImportError:
            print(f"❌ {dep} - No encontrado")
            dependencias_faltantes.append(dep)
    
    if dependencias_faltantes:
        print(f"\n⚠️  Dependencias faltantes: {', '.join(dependencias_faltantes)}")
        print("💡 Ejecuta: pip install -r requirements.txt")
        return False
    
    return True

def crear_estructura_carpetas():
    """Crea la estructura de carpetas necesaria"""
    carpetas = [
        'leyes',
        'resoluciones',
        'circulares', 
        'oficios',
        'schemas',
        'data',
        'logs'
    ]
    
    print("\n📁 Creando estructura de carpetas...")
    
    for carpeta in carpetas:
        try:
            os.makedirs(carpeta, exist_ok=True)
            print(f"✅ {carpeta}/")
        except Exception as e:
            print(f"❌ Error creando {carpeta}/: {str(e)}")
            return False
    
    return True

def test_conectividad():
    """Prueba la conectividad a los sitios web objetivo"""
    import requests
    
    sitios = [
        ('SII', 'https://www.sii.cl'),
        ('LeyChile', 'https://www.leychile.cl')
    ]
    
    print("\n🌐 Verificando conectividad...")
    
    for nombre, url in sitios:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                print(f"✅ {nombre} - Accesible")
            else:
                print(f"⚠️  {nombre} - Código {response.status_code}")
        except Exception as e:
            print(f"❌ {nombre} - Error: {str(e)}")

def crear_configuracion_inicial():
    """Crea archivo de configuración inicial"""
    config = {
        'version': '1.0.0',
        'configurado_en': datetime.now().isoformat(),
        'configuracion': {
            'delay_entre_descargas': 1,
            'reintentos_maximos': 3,
            'timeout_requests': 30,
            'años_descarga_sii': list(range(2020, 2025)),
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        'rutas': {
            'logs': 'logs/',
            'data': 'data/',
            'leyes': 'leyes/',
            'resoluciones': 'resoluciones/',
            'circulares': 'circulares/',
            'schemas': 'schemas/'
        }
    }
    
    try:
        with open('config.json', 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        print("✅ Archivo de configuración creado: config.json")
        return True
    except Exception as e:
        print(f"❌ Error creando configuración: {str(e)}")
        return False

def mostrar_instrucciones_uso():
    """Muestra las instrucciones básicas de uso"""
    print("\n" + "="*50)
    print("🎉 CONFIGURACIÓN COMPLETADA")
    print("="*50)
    print("\n📖 Instrucciones de uso:")
    print("\n1. Para descargar leyes tributarias:")
    print("   python leychile_scraper.py")
    print("\n2. Para descargar normativa del SII:")
    print("   python sii_scraper.py")
    print("\n3. Para ver logs:")
    print("   - Logs en carpeta: logs/")
    print("   - Reportes en carpeta: data/")
    print("\n4. Documentación completa:")
    print("   - Ver README.md para detalles")
    print("\n⚠️  Recomendaciones:")
    print("   - Ejecutar en horarios de baja demanda")
    print("   - Verificar espacio en disco disponible")
    print("   - Revisar logs después de cada ejecución")

def main():
    """Función principal de configuración"""
    print("🔧 SII Scraper - Configuración Inicial")
    print("="*40)
    
    # Lista de verificaciones
    verificaciones = [
        ("Verificando Python", verificar_python),
        ("Verificando dependencias", verificar_dependencias),
        ("Creando estructura de carpetas", crear_estructura_carpetas),
        ("Probando conectividad", test_conectividad),
        ("Creando configuración", crear_configuracion_inicial)
    ]
    
    errores = 0
    
    for descripcion, funcion in verificaciones:
        print(f"\n{descripcion}...")
        try:
            if not funcion():
                errores += 1
        except Exception as e:
            print(f"❌ Error en {descripcion}: {str(e)}")
            errores += 1
    
    if errores == 0:
        mostrar_instrucciones_uso()
    else:
        print(f"\n⚠️  Configuración completada con {errores} errores")
        print("💡 Revisa los mensajes anteriores y corrige los problemas")
    
    return errores == 0

if __name__ == "__main__":
    exito = main()
    sys.exit(0 if exito else 1)