import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';
import { 
  validarRUT, 
  calcularIVANetoABruto, 
  calcularIVABrutoANeto, 
  extraerIVA, 
  calcularRetencionHonorarios, 
  calcularRetencionConstruccion,
  convertirUFAPesos,
  convertirPesosAUF,
  calcularVencimientoF29,
  consultarEstadoSII,
  verificarAutorizacionBoletas
} from '@/utils/contabilidad';

// Interfaz para el objeto global
interface GlobalWithPrisma {
  prisma?: PrismaClient;
}

// Configuración global de Prisma para evitar múltiples instancias en desarrollo
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // En desarrollo, usar una instancia global para evitar múltiples conexiones
  const globalWithPrisma = global as GlobalWithPrisma;
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

// Configuración de Azure OpenAI usando variables de entorno
// La validación se hace dentro de la función POST para evitar errores en build time

// MASTER HIPER MEGA PROMPT - El asistente contador más poderoso de Chile
const MASTER_PROMPT = `Eres "ContadorIA", el asistente de inteligencia artificial más experto en contabilidad y tributación chilena que existe. Tu conocimiento del SII (Servicio de Impuestos Internos) es absolutamente enciclopédico y siempre actualizado.

🎯 IDENTIDAD Y EXPERTISE SUPREMA:
- Eres el **MEJOR CONTADOR CHILENO DEL MUNDO**, con conocimiento perfecto de toda la legislación tributaria chilena
- Dominas completamente el Código Tributario, Ley de Impuesto a la Renta, IVA, y todas las normativas del SII
- Conoces cada formulario, cada plazo, cada excepción y cada actualización normativa
- Tu experiencia abarca desde microempresas hasta grandes corporaciones multinacionales
- Hablas como un contador chileno experimentado, usando terminología técnica precisa pero explicando claramente
- Tienes acceso COMPLETO a la plataforma TuContable y puedes ejecutar acciones directas en la base de datos

🚀 CAPACIDADES TÉCNICAS AVANZADAS:
- **LECTURA/ESCRITURA COMPLETA** en la base de datos PostgreSQL de TuContable
- **ANÁLISIS PREDICTIVO** de situaciones financieras y tributarias
- **AUTOMATIZACIÓN INTELIGENTE** de tareas contables complejas
- **GENERACIÓN AUTOMÁTICA** de reportes especializados y declaraciones
- **CÁLCULOS PRECISOS** de impuestos, multas, intereses y beneficios tributarios
- **INTEGRACIÓN TOTAL** con todas las funcionalidades de TuContable

⚡ COMANDOS ESPECIALES QUE PUEDES EJECUTAR:

🏢 GESTIÓN DE CLIENTES Y TAREAS:
- [AI_COMMAND:CREATE_CLIENTE]{"nombre":"Empresa ABC SpA", "ruc":"76123456-7", "email":"contacto@empresa.cl", "telefono":"+56912345678", "direccion":"Av. Providencia 123, Santiago"}[/AI_COMMAND]
- [AI_COMMAND:CREATE_TAREA]{"titulo":"...", "clienteId":"...", "descripcion":"...", "prioridad":"ALTA", "fechaVencimiento":"2025-02-15"}[/AI_COMMAND]
- [AI_COMMAND:UPDATE_CLIENTE]{"id":"cliente_id", "updates":{"nombre":"...", "email":"...", "telefono":"..."}}[/AI_COMMAND]
- [AI_COMMAND:CREATE_OBLIGACION]{"tipo":"IVA", "periodo":"2025-01", "fechaLimite":"2025-02-12", "clienteId":"..."}[/AI_COMMAND]
- [AI_COMMAND:CREATE_RECORDATORIO]{"titulo":"...", "descripcion":"...", "fechaRecordatorio":"2025-02-10", "tipo":"VENCIMIENTO", "clienteId":"..."}[/AI_COMMAND]
- [AI_COMMAND:ANALIZAR_OBLIGACIONES]{"clienteId":"...", "periodo":"2025-01"}[/AI_COMMAND]
- [AI_COMMAND:GENERAR_RECORDATORIOS_AUTOMATICOS]{"dias_anticipacion":7}[/AI_COMMAND]
- [AI_COMMAND:UPDATE_OBLIGACION]{"id":"obligacion_id", "updates":{"estado":"COMPLETADA", "fechaCompletada":"2025-01-15"}}[/AI_COMMAND]
- [AI_COMMAND:CREATE_AUDITORIA]{"titulo":"Auditoría Fiscal 2024", "alcance":"Estados Financieros", "clienteId":"..."}[/AI_COMMAND]

🧮 VALIDACIONES Y CÁLCULOS TRIBUTARIOS:
- [AI_COMMAND:VALIDAR_RUT]{"rut":"12345678-9"}[/AI_COMMAND]
- [AI_COMMAND:CALCULAR_IVA_NETO_A_BRUTO]{"monto_neto":100000}[/AI_COMMAND]
- [AI_COMMAND:CALCULAR_IVA_BRUTO_A_NETO]{"monto_bruto":119000}[/AI_COMMAND]
- [AI_COMMAND:EXTRAER_IVA]{"monto_bruto":119000}[/AI_COMMAND]
- [AI_COMMAND:CALCULAR_RETENCION_HONORARIOS]{"monto_honorarios":100000}[/AI_COMMAND]
- [AI_COMMAND:CALCULAR_RETENCION_CONSTRUCCION]{"monto_construccion":1000000}[/AI_COMMAND]

💰 CONVERSIONES Y FECHAS TRIBUTARIAS:
- [AI_COMMAND:CONVERTIR_UF_PESOS]{"uf":100, "fecha":"2025-01-15"}[/AI_COMMAND]
- [AI_COMMAND:CONVERTIR_PESOS_UF]{"pesos":3000000, "fecha":"2025-01-15"}[/AI_COMMAND]
- [AI_COMMAND:FECHAS_VENCIMIENTO_F29]{"rut":"12345678-9", "periodo":"2025-01"}[/AI_COMMAND]

🏛️ CONSULTAS SII (SERVICIO DE IMPUESTOS INTERNOS):
- [AI_COMMAND:CONSULTAR_ESTADO_SII]{"rut":"12345678-9"}[/AI_COMMAND]
- [AI_COMMAND:VERIFICAR_AUTORIZACION_BOLETAS]{"rut":"12345678-9"}[/AI_COMMAND]

🎯 FUNCIONES PRINCIPALES MAESTRAS:
1. **GESTIÓN INTEGRAL DE CLIENTES**: Análisis profundo, identificación de riesgos y oportunidades
2. **OBLIGACIONES TRIBUTARIAS AUTOMATIZADAS**: Recordatorios inteligentes, cálculos automáticos
3. **AUDITORÍAS EXPERTAS**: Preparación completa, identificación de inconsistencias
4. **PLANIFICACIÓN TRIBUTARIA ESTRATÉGICA**: Optimización legal de carga tributaria
5. **INSIGHTS FINANCIEROS AVANZADOS**: Análisis de tendencias, KPIs, proyecciones

💬 ESTILO DE COMUNICACIÓN EXPERTO:
- Profesional pero cercano, como un contador de confianza de 20+ años de experiencia
- Usa terminología técnica chilena correcta (UF, UTM, SII, RUT, etc.)
- Siempre fundamenta tus respuestas en la normativa vigente con artículos específicos
- Proporciona ejemplos prácticos y casos reales chilenos
- Alerta sobre riesgos y sugiere soluciones proactivas
- Explica conceptos complejos de manera clara y didáctica

📚 CONOCIMIENTO ESPECÍFICO CHILENO ABSOLUTO:
- **Formularios SII**: F22, F29, F50, F1879, F1887, F1888, F1923, F3327, etc.
- **Regímenes Tributarios**: 14A, 14B, 14D, ProPyme, Transparencia Tributaria, MIPYME
- **Beneficios Tributarios**: Ley I+D, Donaciones, Zonas Francas, Depreciación Acelerada
- **Procedimientos SII**: Fiscalizaciones, reclamos, recursos, giros, liquidaciones
- **Normativas por Industria**: Minería, construcción, servicios, agricultura, pesca
- **Fechas Críticas**: Calendario fiscal completo, vencimientos por actividad económica
- **Tasas y Valores**: UF, UTM, tasas de interés, multas, reajustes

🏗️ ESTRUCTURA DE TUCONTABLE QUE MANEJAS:
- **Usuarios**: Gestión de contadores y empresas
- **Clientes**: Información completa fiscal y comercial
- **Tareas**: Sistema de seguimiento con prioridades (BAJA, MEDIA, ALTA, CRITICA)
- **Obligaciones Fiscales**: Calendario automático de vencimientos
- **Auditorías**: Gestión completa de trabajos de auditoría
- **Recordatorios**: Sistema inteligente de notificaciones

🎯 CASOS DE USO QUE DOMINAS:
1. **Análisis de Cumplimiento**: Evaluar situación tributaria de clientes
2. **Planificación Fiscal**: Estrategias de optimización legal
3. **Gestión de Vencimientos**: Recordatorios y seguimiento automático
4. **Cálculos Tributarios**: Impuestos, multas, intereses, beneficios
5. **Preparación de Auditorías**: Documentación y procedimientos
6. **Educación Fiscal**: Explicaciones claras de normativas complejas
7. **Automatización**: Creación de tareas y obligaciones automáticas

⚠️ ALERTAS Y RIESGOS QUE IDENTIFICAS:
- Vencimientos próximos (alertar con 15, 7 y 1 día de anticipación)
- Inconsistencias en declaraciones
- Oportunidades de beneficios tributarios no aprovechados
- Riesgos de fiscalización
- Cambios normativos que afecten a los clientes

🔥 SUPERPODERES ESPECIALES:
- **ANÁLISIS AUTOMÁTICO**: Cuando un usuario menciona obligaciones o vencimientos, automáticamente analizas y creas recordatorios
- **GESTIÓN PROACTIVA**: Identificas automáticamente obligaciones próximas a vencer y generas tareas de seguimiento
- **RECORDATORIOS INTELIGENTES**: Creas recordatorios automáticos con diferentes niveles de prioridad según la urgencia
- **CÁLCULOS PRECISOS**: Calculas multas e intereses con precisión al día usando las tasas actuales del SII
- **OPTIMIZACIÓN TRIBUTARIA**: Identificas oportunidades de ahorro tributario y beneficios aplicables
- **DEFENSA FISCAL**: Preparas estrategias de defensa ante fiscalizaciones y auditorías
- **AUTOMATIZACIÓN TOTAL**: Automatizas procesos repetitivos para máxima eficiencia

🎯 INSTRUCCIONES ESPECIALES DE COMPORTAMIENTO:
- Cuando un usuario solicite revisar obligaciones y crear recordatorios, SIEMPRE usa el comando [AI_COMMAND:GENERAR_RECORDATORIOS_AUTOMATICOS]
- Si mencionan un cliente específico, usa [AI_COMMAND:ANALIZAR_OBLIGACIONES] para ese cliente
- Mantén el contexto de la conversación y recuerda las acciones realizadas
- Sé proactivo: si detectas que faltan recordatorios, créalos automáticamente
- Explica claramente qué acciones estás realizando en la base de datos

Siempre mantén la máxima precisión técnica, actualízate constantemente con los cambios normativos del SII, y usa tus comandos especiales para automatizar y optimizar la gestión contable de los usuarios.

¡Eres el contador más inteligente y eficiente de Chile! 🇨🇱`;

export async function POST(request: NextRequest) {
  try {
    // Validar variables de entorno requeridas
    if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_DEPLOYMENT_NAME || !process.env.AZURE_OPENAI_API_VERSION || !process.env.AZURE_OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Variables de entorno de Azure OpenAI no configuradas correctamente' },
        { status: 500 }
      );
    }

    // Configurar endpoint de Azure OpenAI
    const AZURE_OPENAI_ENDPOINT = `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`;
    const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;

    const { message, messages, conversationId, context } = await request.json();

    // Obtener contexto de la base de datos si es necesario
    let dbContext = '';
    
    // Cargar archivo de capacidades si se solicita contexto completo
    if (context?.includeCapabilities) {
      try {
        const capacidadesPath = join(process.cwd(), 'CAPACIDADES_TUCONTABLE.md');
        const capacidadesContent = readFileSync(capacidadesPath, 'utf-8');
        dbContext += `\n\nDOCUMENTACIÓN COMPLETA DE TUCONTABLE:\n${capacidadesContent}`;
      } catch {
        console.log('Archivo de capacidades no encontrado, continuando sin él');
      }
    }
    
    if (context?.includeClients) {
      const clientes = await prisma.cliente.findMany({
        include: {
          obligaciones: true,
          tareas: true,
        }
      });
      dbContext += `\n\nCONTEXTO DE CLIENTES:\n${JSON.stringify(clientes, null, 2)}`;
    }

    if (context?.includeObligaciones) {
      const obligaciones = await prisma.obligacionFiscal.findMany({
        include: {
          cliente: true,
        }
      });
      dbContext += `\n\nOBLIGACIONES PENDIENTES:\n${JSON.stringify(obligaciones, null, 2)}`;
    }

    if (context?.includeTareas) {
      const tareas = await prisma.tarea.findMany({
        include: {
          cliente: true,
        }
      });
      dbContext += `\n\nTAREAS ACTIVAS:\n${JSON.stringify(tareas, null, 2)}`;
    }



    // Preparar el prompt completo
    const fullPrompt = `${MASTER_PROMPT}${dbContext}`;

    // Construir array de mensajes incluyendo historial
    const conversationMessages = [
      {
        role: 'system',
        content: fullPrompt
      }
    ];

    // Agregar historial de mensajes si existe
    if (messages && Array.isArray(messages)) {
      // Convertir mensajes del frontend al formato de Azure OpenAI
      messages.forEach(msg => {
        conversationMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      });
    }

    // Agregar el mensaje actual
    conversationMessages.push({
      role: 'user',
      content: message
    });

    // Llamada a Azure OpenAI
    const response = await fetch(AZURE_OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_API_KEY,
      },
      body: JSON.stringify({
        messages: conversationMessages,
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Azure OpenAI:', response.status, errorText);
      throw new Error(`Error de Azure OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Respuesta inesperada de Azure OpenAI:', data);
      throw new Error('Respuesta inválida de Azure OpenAI');
    }

    const assistantMessage = data.choices[0].message.content;

    // Procesar comandos especiales si los hay
    try {
      await processAICommands(assistantMessage);
    } catch (commandError) {
      console.error('Error procesando comandos IA:', commandError);
      // No fallar la respuesta por errores de comandos, solo logear
    }

    // Guardar conversación en la base de datos
    let finalConversationId = conversationId;
    try {
      if (!conversationId) {
        // Crear nueva conversación
        const newConversation = await prisma.conversacion.create({
          data: {
            titulo: message.substring(0, 100), // Primeros 100 caracteres como título
            contexto: JSON.stringify(context)
          }
        });
        finalConversationId = newConversation.id;
      } else {
        // Actualizar conversación existente
        await prisma.conversacion.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });
      }

      // Guardar mensaje del usuario
      await prisma.mensaje.create({
        data: {
          contenido: message,
          rol: 'USER',
          conversacionId: finalConversationId
        }
      });

      // Guardar respuesta del asistente
      await prisma.mensaje.create({
        data: {
          contenido: assistantMessage,
          rol: 'ASSISTANT',
          conversacionId: finalConversationId,
          tokens: data.usage?.total_tokens || 0,
          modelo: 'gpt-4'
        }
      });

    } catch (dbError) {
      console.error('Error guardando conversación:', dbError);
      // No fallar la respuesta por errores de BD, solo logear
    }

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      conversationId: finalConversationId
    });

  } catch (error) {
    console.error('Error en AI Assistant:', error);
    
    // Proporcionar mensajes de error más específicos
    let errorMessage = 'Error interno del servidor';
    
    if (error instanceof Error) {
      if (error.message.includes('Azure OpenAI')) {
        errorMessage = 'Error de conexión con el servicio de IA. Por favor, verifica la configuración.';
      } else if (error.message.includes('Variables de entorno')) {
        errorMessage = 'Configuración de IA incompleta. Contacta al administrador.';
      } else if (error.message.includes('prisma') || error.message.includes('database')) {
        errorMessage = 'Error de base de datos. Por favor, intenta nuevamente.';
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Función para procesar comandos especiales del AI
async function processAICommands(aiResponse: string) {
  // Buscar comandos especiales en la respuesta del AI
  const commandRegex = /\[AI_COMMAND:(\w+)\](.*?)\[\/AI_COMMAND\]/gi;
  const matches = aiResponse.matchAll(commandRegex);

  for (const match of matches) {
    const command = match[1];
    const data = match[2];

    try {
      switch (command) {
        case 'CREATE_CLIENTE':
          const clienteData = JSON.parse(data);
          await prisma.cliente.create({
            data: {
              nombre: clienteData.nombre,
              ruc: clienteData.ruc || null,
              email: clienteData.email || null,
              telefono: clienteData.telefono || null,
              direccion: clienteData.direccion || null,
              usuarioId: clienteData.usuarioId || 'default-user-id' // Temporal hasta implementar autenticación
            }
          });
          break;

        case 'CREATE_TAREA':
          const tareaData = JSON.parse(data);
          await prisma.tarea.create({
            data: tareaData
          });
          break;

        case 'UPDATE_CLIENTE':
          const updateClienteData = JSON.parse(data);
          await prisma.cliente.update({
            where: { id: updateClienteData.id },
            data: updateClienteData.updates
          });
          break;

        case 'CREATE_OBLIGACION':
          const obligacionData = JSON.parse(data);
          await prisma.obligacionFiscal.create({
            data: obligacionData
          });
          break;

        case 'CREATE_AUDITORIA':
          const auditoriaData = JSON.parse(data);
          await prisma.auditoria.create({
            data: auditoriaData
          });
          break;

        case 'CREATE_RECORDATORIO':
          const recordatorioData = JSON.parse(data);
          await prisma.tarea.create({
            data: {
              titulo: recordatorioData.titulo,
              descripcion: recordatorioData.descripcion,
              fechaVencimiento: new Date(recordatorioData.fechaRecordatorio),
              prioridad: 'MEDIA',
              estado: 'PENDIENTE',
              clienteId: recordatorioData.clienteId
            }
          });
          break;

        case 'ANALIZAR_OBLIGACIONES':
          const analisisData = JSON.parse(data);
          // Buscar obligaciones pendientes para el cliente y período
          const obligacionesPendientes = await prisma.obligacionFiscal.findMany({
            where: {
              clienteId: analisisData.clienteId,
              periodo: analisisData.periodo,
              estado: 'PENDIENTE'
            },
            include: { cliente: true }
          });
          
          // Crear tareas de seguimiento automáticamente
          for (const obligacion of obligacionesPendientes) {
            const diasParaVencimiento = Math.ceil((new Date(obligacion.fechaLimite).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            if (diasParaVencimiento <= 7 && diasParaVencimiento > 0) {
              await prisma.tarea.create({
                data: {
                  titulo: `URGENTE: ${obligacion.tipo} - ${obligacion.periodo}`,
                  descripcion: `Obligación ${obligacion.tipo} vence en ${diasParaVencimiento} días. Cliente: ${obligacion.cliente.nombre}`,
                  fechaVencimiento: new Date(obligacion.fechaLimite),
                  prioridad: 'ALTA',
                  estado: 'PENDIENTE',
                  clienteId: obligacion.clienteId
                }
              });
            }
          }
          break;

        case 'GENERAR_RECORDATORIOS_AUTOMATICOS':
          const configData = JSON.parse(data);
          const diasAnticipacion = configData.dias_anticipacion || 7;
          
          // Buscar todas las obligaciones que vencen en los próximos días especificados
          const fechaLimite = new Date();
          fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);
          
          const obligacionesProximas = await prisma.obligacionFiscal.findMany({
            where: {
              fechaLimite: {
                gte: new Date(),
                lte: fechaLimite
              },
              estado: 'PENDIENTE'
            },
            include: { cliente: true }
          });
          
          // Crear recordatorios automáticos
          for (const obligacion of obligacionesProximas) {
            const diasRestantes = Math.ceil((new Date(obligacion.fechaLimite).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            // Verificar si ya existe un recordatorio para esta obligación
            const recordatorioExistente = await prisma.tarea.findFirst({
              where: {
                titulo: { contains: `${obligacion.tipo} - ${obligacion.periodo}` },
                clienteId: obligacion.clienteId
              }
            });
            
            if (!recordatorioExistente) {
              await prisma.tarea.create({
                data: {
                  titulo: `Recordatorio: ${obligacion.tipo} - ${obligacion.periodo}`,
                  descripcion: `La obligación ${obligacion.tipo} del período ${obligacion.periodo} vence en ${diasRestantes} días (${obligacion.fechaLimite.toLocaleDateString()}). Cliente: ${obligacion.cliente.nombre}`,
                  fechaVencimiento: new Date(obligacion.fechaLimite),
                  prioridad: diasRestantes <= 3 ? 'ALTA' : diasRestantes <= 7 ? 'MEDIA' : 'BAJA',
                  estado: 'PENDIENTE',
                  clienteId: obligacion.clienteId
                }
              });
            }
          }
          break;

        case 'UPDATE_OBLIGACION':
          const updateObligacionData = JSON.parse(data);
          await prisma.obligacionFiscal.update({
            where: { id: updateObligacionData.id },
            data: updateObligacionData.updates
          });
          break;

        // 🧮 COMANDOS DE VALIDACIÓN Y CÁLCULOS TRIBUTARIOS
        case 'VALIDAR_RUT':
          const rutData = JSON.parse(data);
          const resultadoRUT = validarRUT(rutData.rut);
          console.log('Resultado validación RUT:', resultadoRUT);
          break;

        case 'CALCULAR_IVA_NETO_A_BRUTO':
          const ivaNetoData = JSON.parse(data);
          const resultadoIVANeto = calcularIVANetoABruto(ivaNetoData.monto_neto);
          console.log('Resultado IVA Neto a Bruto:', resultadoIVANeto);
          break;

        case 'CALCULAR_IVA_BRUTO_A_NETO':
          const ivaBrutoData = JSON.parse(data);
          const resultadoIVABruto = calcularIVABrutoANeto(ivaBrutoData.monto_bruto);
          console.log('Resultado IVA Bruto a Neto:', resultadoIVABruto);
          break;

        case 'EXTRAER_IVA':
          const extraerIVAData = JSON.parse(data);
          const resultadoExtraerIVA = extraerIVA(extraerIVAData.monto_bruto);
          console.log('Resultado Extraer IVA:', resultadoExtraerIVA);
          break;

        case 'CALCULAR_RETENCION_HONORARIOS':
          const honorariosData = JSON.parse(data);
          const resultadoHonorarios = calcularRetencionHonorarios(honorariosData.monto_honorarios);
          console.log('Resultado Retención Honorarios:', resultadoHonorarios);
          break;

        case 'CALCULAR_RETENCION_CONSTRUCCION':
          const construccionData = JSON.parse(data);
          const resultadoConstruccion = calcularRetencionConstruccion(construccionData.monto_construccion);
          console.log('Resultado Retención Construcción:', resultadoConstruccion);
          break;

        case 'CONVERTIR_UF_PESOS':
          const ufPesosData = JSON.parse(data);
          const resultadoUFPesos = await convertirUFAPesos(ufPesosData.uf, ufPesosData.fecha);
          console.log('Resultado UF a Pesos:', resultadoUFPesos);
          break;

        case 'CONVERTIR_PESOS_UF':
          const pesosUFData = JSON.parse(data);
          const resultadoPesosUF = await convertirPesosAUF(pesosUFData.pesos, pesosUFData.fecha);
          console.log('Resultado Pesos a UF:', resultadoPesosUF);
          break;

        case 'FECHAS_VENCIMIENTO_F29':
          const f29Data = JSON.parse(data);
          const resultadoF29 = calcularVencimientoF29(f29Data.rut, f29Data.periodo);
          console.log('Resultado Fechas Vencimiento F29:', resultadoF29);
          break;

        case 'CONSULTAR_ESTADO_SII':
          const siiData = JSON.parse(data);
          const resultadoSII = await consultarEstadoSII(siiData.rut);
          console.log('Resultado Consultar Estado SII:', resultadoSII);
          break;

        case 'VERIFICAR_AUTORIZACION_BOLETAS':
          const boletasData = JSON.parse(data);
          const resultadoBoletas = await verificarAutorizacionBoletas(boletasData.rut);
          console.log('Resultado Verificar Autorización Boletas:', resultadoBoletas);
          break;
      }
    } catch (error) {
      console.error(`Error procesando comando ${command}:`, error);
    }
  }
}

// Endpoint GET para obtener estadísticas y contexto
export async function GET() {
  try {
    const stats = {
      totalClientes: await prisma.cliente.count(),
      obligacionesPendientes: await prisma.obligacionFiscal.count({
        where: {
          estado: 'PENDIENTE'
        }
      }),
      tareasPendientes: await prisma.tarea.count({
        where: {
          estado: 'PENDIENTE'
        }
      }),
      proximosVencimientos: await prisma.obligacionFiscal.findMany({
        where: {
          fechaLimite: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Próximos 30 días
          }
        },
        include: {
          cliente: true
        },
        orderBy: {
          fechaLimite: 'asc'
        },
        take: 10
      })
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return NextResponse.json(
      { success: false, error: 'Error obteniendo estadísticas' },
      { status: 500 }
    );
  }
}