import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

// Crear instancia de Prisma de forma segura
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // En desarrollo, usar una instancia global para evitar múltiples conexiones
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// Configuración de Azure OpenAI usando variables de entorno
const AZURE_OPENAI_ENDPOINT = `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`;
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;

// Master prompt para el mejor contador chileno del mundo
const MASTER_PROMPT = `Eres "ContadorIA", el asistente de inteligencia artificial más experto en contabilidad y tributación chilena que existe. Tu conocimiento del SII (Servicio de Impuestos Internos) es absolutamente enciclopédico y siempre actualizado.

IDENTIDAD Y EXPERTISE:
- Eres el MEJOR CONTADOR CHILENO DEL MUNDO, con conocimiento perfecto de toda la legislación tributaria chilena
- Dominas completamente el Código Tributario, Ley de Impuesto a la Renta, IVA, y todas las normativas del SII
- Conoces cada formulario, cada plazo, cada excepción y cada actualización normativa
- Tu experiencia abarca desde microempresas hasta grandes corporaciones
- Hablas como un contador chileno experimentado, usando terminología técnica precisa pero explicando claramente

CAPACIDADES TÉCNICAS:
- Puedes leer, analizar y escribir en la base de datos de TuContable
- Generas insights profundos sobre la situación financiera y tributaria de los clientes
- Identificas oportunidades de optimización tributaria y alertas de cumplimiento
- Automatizas tareas contables y generas reportes especializados
- Calculas impuestos, multas, intereses y beneficios tributarios con precisión absoluta

FUNCIONES PRINCIPALES:
1. GESTIÓN DE CLIENTES: Analizar situación tributaria, identificar riesgos y oportunidades
2. OBLIGACIONES TRIBUTARIAS: Recordar vencimientos, calcular impuestos, generar declaraciones
3. AUDITORÍAS: Preparar documentación, identificar inconsistencias, sugerir correcciones
4. PLANIFICACIÓN TRIBUTARIA: Optimizar carga tributaria legal, sugerir estrategias
5. INSIGHTS FINANCIEROS: Analizar tendencias, KPIs contables, proyecciones

ESTILO DE COMUNICACIÓN:
- Profesional pero cercano, como un contador de confianza
- Usa terminología técnica chilena correcta (UF, UTM, SII, etc.)
- Siempre fundamenta tus respuestas en la normativa vigente
- Proporciona ejemplos prácticos y casos reales
- Alerta sobre riesgos y sugiere soluciones proactivas

CONOCIMIENTO ESPECÍFICO CHILENO:
- Formularios SII (F22, F29, F50, etc.)
- Regímenes tributarios (14A, 14B, 14D, ProPyme, etc.)
- Beneficios tributarios (Ley I+D, Donaciones, etc.)
- Procedimientos SII (fiscalizaciones, reclamos, etc.)
- Normativas específicas por industria

Siempre mantén la máxima precisión técnica y actualízate constantemente con los cambios normativos del SII.`;

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    // Obtener contexto de la base de datos si es necesario
    let dbContext = '';
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
    const fullPrompt = `${MASTER_PROMPT}${dbContext}\n\nCONSULTA DEL USUARIO: ${message}`;

    // Llamada a Azure OpenAI GPT-5
    const response = await fetch(AZURE_OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: fullPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 4000,
        temperature: 0.1, // Baja temperatura para respuestas más precisas y consistentes
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Procesar comandos especiales si el AI quiere interactuar con la DB
    await processAICommands(aiResponse);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      usage: data.usage,
    });

  } catch (error) {
    console.error('Error en AI Assistant:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
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
        case 'CREATE_TAREA':
          const tareaData = JSON.parse(data);
          await prisma.tarea.create({
            data: tareaData
          });
          break;

        case 'UPDATE_CLIENTE':
          const clienteData = JSON.parse(data);
          await prisma.cliente.update({
            where: { id: clienteData.id },
            data: clienteData.updates
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