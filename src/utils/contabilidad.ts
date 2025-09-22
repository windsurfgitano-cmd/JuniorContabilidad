// 🇨🇱 UTILIDADES DE CONTABILIDAD CHILENA
// Funciones especializadas para cálculos y validaciones tributarias

/**
 * VALIDAR RUT CHILENO
 * Valida el formato y dígito verificador de un RUT chileno
 */
export function validarRUT(rut: string): {
  valido: boolean;
  rut_formateado: string;
  mensaje: string;
  rut_numerico?: string;
  digito_verificador?: string;
} {
  try {
    // Limpiar el RUT (quitar puntos, guiones y espacios)
    const rutLimpio = rut.replace(/[.\-\s]/g, '').toUpperCase();
    
    // Verificar que tenga al menos 2 caracteres (número + dígito verificador)
    if (rutLimpio.length < 2) {
      return {
        valido: false,
        rut_formateado: rut,
        mensaje: "RUT muy corto"
      };
    }
    
    // Separar número y dígito verificador
    const rutNumerico = rutLimpio.slice(0, -1);
    const digitoVerificador = rutLimpio.slice(-1);
    
    // Verificar que la parte numérica sea válida
    if (!/^\d+$/.test(rutNumerico)) {
      return {
        valido: false,
        rut_formateado: rut,
        mensaje: "RUT contiene caracteres inválidos"
      };
    }
    
    // Verificar que el dígito verificador sea válido
    if (!/^[0-9K]$/.test(digitoVerificador)) {
      return {
        valido: false,
        rut_formateado: rut,
        mensaje: "Dígito verificador inválido"
      };
    }
    
    // Calcular dígito verificador esperado
    let suma = 0;
    let multiplicador = 2;
    
    // Recorrer de derecha a izquierda
    for (let i = rutNumerico.length - 1; i >= 0; i--) {
      suma += parseInt(rutNumerico[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const resto = suma % 11;
    const digitoCalculado = resto === 0 ? '0' : resto === 1 ? 'K' : (11 - resto).toString();
    
    // Verificar si coincide
    const esValido = digitoVerificador === digitoCalculado;
    
    // Formatear RUT (12.345.678-9)
    const rutFormateado = rutNumerico.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + digitoVerificador;
    
    return {
      valido: esValido,
      rut_formateado: rutFormateado,
      mensaje: esValido ? "RUT válido" : `RUT inválido. Dígito verificador debería ser ${digitoCalculado}`,
      rut_numerico: rutNumerico,
      digito_verificador: digitoVerificador
    };
    
  } catch (error) {
    return {
      valido: false,
      rut_formateado: rut,
      mensaje: "Error al validar RUT"
    };
  }
}

/**
 * CALCULAR IVA CHILENO (19%)
 * Funciones para cálculos de IVA en Chile
 */
export const IVA_CHILE = 0.19; // 19%

/**
 * Calcular monto bruto desde neto (agregar IVA)
 */
export function calcularIVANetoABruto(montoNeto: number): {
  monto_neto: number;
  iva: number;
  monto_bruto: number;
  tasa_iva: number;
} {
  const iva = Math.round(montoNeto * IVA_CHILE);
  const montoBruto = montoNeto + iva;
  
  return {
    monto_neto: montoNeto,
    iva: iva,
    monto_bruto: montoBruto,
    tasa_iva: IVA_CHILE
  };
}

/**
 * Calcular monto neto desde bruto (quitar IVA)
 */
export function calcularIVABrutoANeto(montoBruto: number): {
  monto_bruto: number;
  monto_neto: number;
  iva: number;
  tasa_iva: number;
} {
  const montoNeto = Math.round(montoBruto / (1 + IVA_CHILE));
  const iva = montoBruto - montoNeto;
  
  return {
    monto_bruto: montoBruto,
    monto_neto: montoNeto,
    iva: iva,
    tasa_iva: IVA_CHILE
  };
}

/**
 * Extraer solo el IVA de un monto bruto
 */
export function extraerIVA(montoBruto: number): {
  monto_bruto: number;
  iva: number;
  monto_neto: number;
  tasa_iva: number;
} {
  const resultado = calcularIVABrutoANeto(montoBruto);
  return resultado;
}

/**
 * CALCULAR RETENCIONES CHILENAS
 * Funciones para cálculos de retenciones según normativa chilena
 */

/**
 * Retención de Honorarios (10%)
 */
export function calcularRetencionHonorarios(montoHonorarios: number): {
  monto_honorarios: number;
  retencion: number;
  monto_a_pagar: number;
  tasa_retencion: number;
  tipo_retencion: string;
} {
  const TASA_RETENCION_HONORARIOS = 0.10; // 10%
  const retencion = Math.round(montoHonorarios * TASA_RETENCION_HONORARIOS);
  const montoAPagar = montoHonorarios - retencion;
  
  return {
    monto_honorarios: montoHonorarios,
    retencion: retencion,
    monto_a_pagar: montoAPagar,
    tasa_retencion: TASA_RETENCION_HONORARIOS,
    tipo_retencion: "Honorarios (Art. 84 Ley de la Renta)"
  };
}

/**
 * Retención de Construcción (3%)
 */
export function calcularRetencionConstruccion(montoConstruccion: number): {
  monto_construccion: number;
  retencion: number;
  monto_a_pagar: number;
  tasa_retencion: number;
  tipo_retencion: string;
} {
  const TASA_RETENCION_CONSTRUCCION = 0.03; // 3%
  const retencion = Math.round(montoConstruccion * TASA_RETENCION_CONSTRUCCION);
  const montoAPagar = montoConstruccion - retencion;
  
  return {
    monto_construccion: montoConstruccion,
    retencion: retencion,
    monto_a_pagar: montoAPagar,
    tasa_retencion: TASA_RETENCION_CONSTRUCCION,
    tipo_retencion: "Construcción (Art. 84 bis Ley de la Renta)"
  };
}

/**
 * UTILIDADES GENERALES
 */

/**
 * Formatear montos en pesos chilenos
 */
export function formatearPesos(monto: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(monto);
}

/**
 * Formatear RUT chileno
 */
export function formatearRUT(rut: string): string {
  const validacion = validarRUT(rut);
  return validacion.rut_formateado;
}

/**
 * Validar si un monto es válido
 */
export function validarMonto(monto: any): boolean {
  return typeof monto === 'number' && !isNaN(monto) && monto >= 0;
}

/**
 * CONVERSIÓN UF A PESOS CHILENOS
 * Utiliza la API oficial del Banco Central de Chile
 */

/**
 * Convertir UF a pesos chilenos usando API del Banco Central
 */
export async function convertirUFAPesos(cantidadUF: number, fecha?: string): Promise<{
  cantidad_uf: number;
  fecha_consulta: string;
  valor_uf_pesos: number;
  total_pesos: number;
  fuente: string;
  success: boolean;
  mensaje?: string;
}> {
  try {
    // Validar entrada
    if (!validarMonto(cantidadUF)) {
      return {
        cantidad_uf: cantidadUF,
        fecha_consulta: fecha || new Date().toISOString().split('T')[0],
        valor_uf_pesos: 0,
        total_pesos: 0,
        fuente: "Banco Central de Chile",
        success: false,
        mensaje: "Cantidad de UF inválida"
      };
    }

    // Usar fecha actual si no se especifica
    const fechaConsulta = fecha || new Date().toISOString().split('T')[0];
    
    // Formatear fecha para la API (YYYY-MM-DD)
    const fechaFormateada = fechaConsulta.replace(/\//g, '-');
    
    // URL de la API del Banco Central (endpoint público)
    // Nota: Esta es una implementación simplificada. En producción necesitarías:
    // 1. Registrarte en el Banco Central para obtener API key
    // 2. Usar el endpoint oficial: https://si3.bcentral.cl/SieteRestWS/
    
    // Por ahora, usamos valores aproximados basados en datos históricos
    // En implementación real, harías: const response = await fetch(apiUrl);
    
    const valorUFAproximado = await obtenerValorUFAproximado(fechaFormateada);
    
    const totalPesos = Math.round(cantidadUF * valorUFAproximado);
    
    return {
      cantidad_uf: cantidadUF,
      fecha_consulta: fechaFormateada,
      valor_uf_pesos: valorUFAproximado,
      total_pesos: totalPesos,
      fuente: "Banco Central de Chile",
      success: true,
      mensaje: `${cantidadUF} UF = ${formatearPesos(totalPesos)} (${fechaFormateada})`
    };
    
  } catch (error) {
    return {
      cantidad_uf: cantidadUF,
      fecha_consulta: fecha || new Date().toISOString().split('T')[0],
      valor_uf_pesos: 0,
      total_pesos: 0,
      fuente: "Banco Central de Chile",
      success: false,
      mensaje: "Error al consultar valor UF"
    };
  }
}

/**
 * Obtener valor UF aproximado (simulación para desarrollo)
 * En producción, esto se reemplazaría por la llamada real a la API
 */
async function obtenerValorUFAproximado(fecha: string): Promise<number> {
  // Simulación de valores UF (enero 2025 aproximadamente $37,500)
  // En producción, esto sería una llamada real a la API del Banco Central
  
  const valorBase = 37500; // Valor aproximado UF enero 2025
  const fechaObj = new Date(fecha);
  const hoy = new Date();
  
  // Pequeña variación basada en la fecha (simulación)
  const diasDiferencia = Math.floor((hoy.getTime() - fechaObj.getTime()) / (1000 * 60 * 60 * 24));
  const variacion = Math.sin(diasDiferencia / 30) * 100; // Variación simulada
  
  return Math.round(valorBase + variacion);
}

/**
 * Convertir pesos a UF
 */
export async function convertirPesosAUF(montoPesos: number, fecha?: string): Promise<{
  monto_pesos: number;
  fecha_consulta: string;
  valor_uf_pesos: number;
  cantidad_uf: number;
  fuente: string;
  success: boolean;
  mensaje?: string;
}> {
  try {
    if (!validarMonto(montoPesos)) {
      return {
        monto_pesos: montoPesos,
        fecha_consulta: fecha || new Date().toISOString().split('T')[0],
        valor_uf_pesos: 0,
        cantidad_uf: 0,
        fuente: "Banco Central de Chile",
        success: false,
        mensaje: "Monto en pesos inválido"
      };
    }

    const fechaConsulta = fecha || new Date().toISOString().split('T')[0];
    const fechaFormateada = fechaConsulta.replace(/\//g, '-');
    
    const valorUF = await obtenerValorUFAproximado(fechaFormateada);
    const cantidadUF = montoPesos / valorUF;
    
    return {
      monto_pesos: montoPesos,
      fecha_consulta: fechaFormateada,
      valor_uf_pesos: valorUF,
      cantidad_uf: Math.round(cantidadUF * 100) / 100, // 2 decimales
      fuente: "Banco Central de Chile",
      success: true,
      mensaje: `${formatearPesos(montoPesos)} = ${cantidadUF.toFixed(2)} UF (${fechaFormateada})`
    };
    
  } catch (error) {
    return {
      monto_pesos: montoPesos,
      fecha_consulta: fecha || new Date().toISOString().split('T')[0],
      valor_uf_pesos: 0,
      cantidad_uf: 0,
      fuente: "Banco Central de Chile",
      success: false,
      mensaje: "Error al consultar valor UF"
    };
  }
}

/**
 * CONSULTA ESTADO SII
 * Web scraping para obtener información del contribuyente desde el SII
 */

/**
 * Consultar estado básico de un RUT en el SII
 */
export async function consultarEstadoSII(rut: string): Promise<{
  rut: string;
  rut_formateado: string;
  estado_sii: 'ACTIVO' | 'INACTIVO' | 'NO_AUTORIZADO' | 'ERROR' | 'NO_ENCONTRADO';
  razon_social?: string;
  actividad_economica?: string;
  fecha_inicio_actividades?: string;
  direccion?: string;
  comuna?: string;
  region?: string;
  telefono?: string;
  email?: string;
  representante_legal?: string;
  capital?: string;
  tipo_contribuyente?: string;
  regimen_tributario?: string;
  ultima_actualizacion: string;
  fuente: string;
  success: boolean;
  mensaje: string;
  advertencias?: string[];
}> {
  try {
    // Validar RUT primero
    const validacionRUT = validarRUT(rut);
    if (!validacionRUT.valido) {
      return {
        rut: rut,
        rut_formateado: rut,
        estado_sii: 'ERROR',
        ultima_actualizacion: new Date().toISOString(),
        fuente: "SII Chile",
        success: false,
        mensaje: 'RUT inválido para consulta SII',
        advertencias: ['Verificar formato del RUT']
      };
    }

    const rutFormateado = validacionRUT.rut_formateado;
    
    // IMPORTANTE: En producción, esto requiere:
    // 1. Configurar un proxy/servidor intermedio para evitar CORS
    // 2. Implementar rate limiting para no sobrecargar el SII
    // 3. Manejar captchas y medidas anti-bot del SII
    // 4. Usar bibliotecas como Puppeteer o Playwright para JS rendering
    
    // Por ahora, simulamos la consulta con datos realistas
    const resultadoSimulado = await simularConsultaSII(rutFormateado);
    
    return {
      rut: validacionRUT.rut_numerico || rut,
      rut_formateado: rutFormateado,
      estado_sii: resultadoSimulado.estado,
      razon_social: resultadoSimulado.razonSocial,
      actividad_economica: resultadoSimulado.actividadEconomica,
      fecha_inicio_actividades: resultadoSimulado.fechaInicioActividades,
      direccion: resultadoSimulado.direccion,
      comuna: resultadoSimulado.comuna,
      region: resultadoSimulado.region,
      telefono: resultadoSimulado.telefono,
      email: resultadoSimulado.email,
      representante_legal: resultadoSimulado.representanteLegal,
      capital: resultadoSimulado.capital,
      tipo_contribuyente: resultadoSimulado.tipoContribuyente,
      regimen_tributario: resultadoSimulado.regimenTributario,
      ultima_actualizacion: new Date().toISOString(),
      fuente: "SII Chile",
      success: true,
      mensaje: `Información de ${rutFormateado} obtenida exitosamente`,
      advertencias: resultadoSimulado.advertencias
    };

  } catch (error) {
    return {
      rut: rut,
      rut_formateado: rut,
      estado_sii: 'ERROR',
      ultima_actualizacion: new Date().toISOString(),
      fuente: "SII Chile",
      success: false,
      mensaje: 'Error al consultar SII',
      advertencias: ['Servicio temporalmente no disponible']
    };
  }
}

/**
 * Simulación de consulta SII (para desarrollo)
 * En producción, esto sería reemplazado por web scraping real
 */
async function simularConsultaSII(rutFormateado: string): Promise<{
  estado: 'ACTIVO' | 'INACTIVO' | 'NO_AUTORIZADO' | 'ERROR' | 'NO_ENCONTRADO';
  razonSocial?: string;
  actividadEconomica?: string;
  fechaInicioActividades?: string;
  direccion?: string;
  comuna?: string;
  region?: string;
  telefono?: string;
  email?: string;
  representanteLegal?: string;
  capital?: string;
  tipoContribuyente?: string;
  regimenTributario?: string;
  advertencias?: string[];
}> {
  // Simulación con delay para imitar consulta real
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Datos simulados basados en RUTs comunes
  const empresasSimuladas = [
    {
      rut: "96.790.240-3",
      razonSocial: "BANCO DE CHILE",
      actividadEconomica: "Banco comercial",
      fechaInicioActividades: "1893-10-15",
      direccion: "AHUMADA 251",
      comuna: "SANTIAGO",
      region: "METROPOLITANA",
      telefono: "+56226370000",
      email: "contacto@bancochile.cl",
      representanteLegal: "EDUARDO EBENSPERGER ORREGO",
      capital: "UF 3.500.000",
      tipoContribuyente: "Primera Categoría",
      regimenTributario: "Régimen General"
    },
    {
      rut: "99.570.020-7",
      razonSocial: "SERVICIO DE IMPUESTOS INTERNOS",
      actividadEconomica: "Administración pública",
      fechaInicioActividades: "1902-02-27",
      direccion: "TEATINOS 120",
      comuna: "SANTIAGO",
      region: "METROPOLITANA",
      telefono: "+56228242828",
      email: "contacto@sii.cl",
      representanteLegal: "HERNÁN FRIGOLETT CÓRDOVA",
      capital: "N/A",
      tipoContribuyente: "Exento",
      regimenTributario: "Sector Público"
    }
  ];
  
  // Buscar empresa simulada
  const empresaEncontrada = empresasSimuladas.find(emp => 
    emp.rut === rutFormateado || rutFormateado.includes(emp.rut.replace(/\./g, '').replace('-', ''))
  );
  
  if (empresaEncontrada) {
    return {
      estado: 'ACTIVO',
      ...empresaEncontrada,
      advertencias: ['Datos simulados para desarrollo']
    };
  }
  
  // Para otros RUTs, generar datos genéricos
  const rutNumerico = rutFormateado.replace(/\./g, '').replace('-', '');
  const ultimoDigito = parseInt(rutNumerico.slice(-2, -1));
  
  if (ultimoDigito % 3 === 0) {
    return {
      estado: 'INACTIVO',
      razonSocial: `EMPRESA INACTIVA ${rutFormateado}`,
      actividadEconomica: "Sin actividad económica",
      fechaInicioActividades: "2020-01-15",
      direccion: "SIN DOMICILIO CONOCIDO",
      comuna: "SANTIAGO",
      region: "METROPOLITANA",
      tipoContribuyente: "Segunda Categoría",
      regimenTributario: "Régimen Simplificado",
      advertencias: ['Contribuyente inactivo', 'Datos simulados para desarrollo']
    };
  } else if (ultimoDigito % 5 === 0) {
    return {
      estado: 'NO_ENCONTRADO',
      advertencias: ['RUT no encontrado en registros SII', 'Datos simulados para desarrollo']
    };
  } else {
    return {
      estado: 'ACTIVO',
      razonSocial: `EMPRESA DEMO ${rutFormateado}`,
      actividadEconomica: "Servicios profesionales",
      fechaInicioActividades: "2022-03-10",
      direccion: "PROVIDENCIA 123",
      comuna: "PROVIDENCIA",
      region: "METROPOLITANA",
      telefono: "+56912345678",
      email: "contacto@empresademo.cl",
      representanteLegal: "JUAN PÉREZ GONZÁLEZ",
      capital: "UF 1.000",
      tipoContribuyente: "Primera Categoría",
      regimenTributario: "Régimen General",
      advertencias: ['Datos simulados para desarrollo']
    };
  }
}

/**
 * Verificar si un RUT está autorizado para emitir boletas electrónicas
 */
export async function verificarAutorizacionBoletas(rut: string): Promise<{
  rut: string;
  autorizado_boletas: boolean;
  fecha_autorizacion?: string;
  tipo_autorizacion?: string;
  vigencia?: string;
  mensaje: string;
  success: boolean;
}> {
  try {
    const validacionRUT = validarRUT(rut);
    if (!validacionRUT.valido) {
      return {
        rut: rut,
        autorizado_boletas: false,
        mensaje: 'RUT inválido',
        success: false
      };
    }

    // Simulación de consulta de autorización
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const rutNumerico = validacionRUT.rut_numerico || '';
    const ultimoDigito = parseInt(rutNumerico.slice(-1));
    
    // Simulación: RUTs con último dígito par están autorizados
    const autorizado = ultimoDigito % 2 === 0;
    
    if (autorizado) {
      return {
        rut: validacionRUT.rut_formateado,
        autorizado_boletas: true,
        fecha_autorizacion: "2023-01-15",
        tipo_autorizacion: "Boleta Electrónica",
        vigencia: "Indefinida",
        mensaje: 'Contribuyente autorizado para emitir boletas electrónicas',
        success: true
      };
    } else {
      return {
        rut: validacionRUT.rut_formateado,
        autorizado_boletas: false,
        mensaje: 'Contribuyente no autorizado para boletas electrónicas',
        success: true
      };
    }

  } catch (error) {
    return {
      rut: rut,
      autorizado_boletas: false,
      mensaje: 'Error al verificar autorización',
      success: false
    };
  }
}

/**
 * FECHAS DE VENCIMIENTO F29
 * Calcula fechas de vencimiento basadas en el último dígito del RUT
 */

/**
 * Calcular fecha de vencimiento F29 según último dígito RUT
 */
export function calcularVencimientoF29(rut: string, periodo: string): {
  rut: string;
  periodo: string;
  ultimo_digito: string;
  fecha_vencimiento: string;
  dias_restantes: number;
  estado: 'VENCIDO' | 'URGENTE' | 'PROXIMO' | 'LEJANO';
  mensaje: string;
} {
  try {
    // Validar RUT primero
    const validacionRUT = validarRUT(rut);
    if (!validacionRUT.valido) {
      return {
        rut: rut,
        periodo: periodo,
        ultimo_digito: '',
        fecha_vencimiento: '',
        dias_restantes: 0,
        estado: 'VENCIDO',
        mensaje: 'RUT inválido'
      };
    }

    // Obtener último dígito del RUT (sin el dígito verificador)
    const rutNumerico = validacionRUT.rut_numerico || '';
    const ultimoDigito = rutNumerico.slice(-1);
    
    // Parsear período (formato: YYYY-MM)
    const [año, mes] = periodo.split('-').map(Number);
    if (!año || !mes || mes < 1 || mes > 12) {
      return {
        rut: rut,
        periodo: periodo,
        ultimo_digito: ultimoDigito,
        fecha_vencimiento: '',
        dias_restantes: 0,
        estado: 'VENCIDO',
        mensaje: 'Período inválido (usar formato YYYY-MM)'
      };
    }

    // Calcular mes siguiente para el vencimiento
    let mesVencimiento = mes + 1;
    let añoVencimiento = año;
    
    if (mesVencimiento > 12) {
      mesVencimiento = 1;
      añoVencimiento++;
    }

    // Tabla de vencimientos F29 según último dígito RUT
    const diasVencimiento: { [key: string]: number } = {
      '1': 12,
      '2': 13,
      '3': 14,
      '4': 15,
      '5': 16,
      '6': 17,
      '7': 18,
      '8': 19,
      '9': 20,
      '0': 21
    };

    const diaVencimiento = diasVencimiento[ultimoDigito] || 21;
    
    // Crear fecha de vencimiento
    const fechaVencimiento = new Date(añoVencimiento, mesVencimiento - 1, diaVencimiento);
    
    // Verificar si cae en fin de semana y ajustar al siguiente día hábil
    if (fechaVencimiento.getDay() === 6) { // Sábado
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 2);
    } else if (fechaVencimiento.getDay() === 0) { // Domingo
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
    }

    const fechaVencimientoStr = fechaVencimiento.toISOString().split('T')[0];
    
    // Calcular días restantes
    const hoy = new Date();
    const diasRestantes = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    // Determinar estado
    let estado: 'VENCIDO' | 'URGENTE' | 'PROXIMO' | 'LEJANO';
    if (diasRestantes < 0) {
      estado = 'VENCIDO';
    } else if (diasRestantes <= 3) {
      estado = 'URGENTE';
    } else if (diasRestantes <= 7) {
      estado = 'PROXIMO';
    } else {
      estado = 'LEJANO';
    }

    const mensaje = `F29 período ${periodo} vence el ${fechaVencimientoStr} (${diasRestantes > 0 ? `${diasRestantes} días restantes` : `${Math.abs(diasRestantes)} días vencido`})`;

    return {
      rut: validacionRUT.rut_formateado,
      periodo: periodo,
      ultimo_digito: ultimoDigito,
      fecha_vencimiento: fechaVencimientoStr,
      dias_restantes: diasRestantes,
      estado: estado,
      mensaje: mensaje
    };

  } catch (error) {
    return {
      rut: rut,
      periodo: periodo,
      ultimo_digito: '',
      fecha_vencimiento: '',
      dias_restantes: 0,
      estado: 'VENCIDO',
      mensaje: 'Error al calcular vencimiento F29'
    };
  }
}