import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Obtener conversaciones con sus mensajes
    const conversaciones = await prisma.conversacion.findMany({
      include: {
        mensajes: {
          orderBy: { timestamp: 'asc' },
          take: 3 // Solo los primeros 3 mensajes para preview
        },
        _count: {
          select: { mensajes: true }
        }
      },
      orderBy: { fechaActualizacion: 'desc' },
      skip,
      take: limit
    });

    // Obtener total para paginación
    const total = await prisma.conversacion.count();

    return NextResponse.json({
      success: true,
      data: {
        conversaciones,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo conversaciones:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de conversación requerido' },
        { status: 400 }
      );
    }

    // Eliminar mensajes primero (por la relación)
    await prisma.mensaje.deleteMany({
      where: { conversacionId: id }
    });

    // Eliminar conversación
    await prisma.conversacion.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Conversación eliminada correctamente'
    });

  } catch (error) {
    console.error('Error eliminando conversación:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}