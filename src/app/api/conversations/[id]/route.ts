import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const conversacion = await prisma.conversacion.findUnique({
      where: { id },
      include: {
        mensajes: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversacion) {
      return NextResponse.json(
        { success: false, error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: conversacion
    });

  } catch (error) {
    console.error('Error obteniendo conversación:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}