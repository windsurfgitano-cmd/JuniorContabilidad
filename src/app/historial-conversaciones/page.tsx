'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, Trash2, Eye, Search, Filter } from 'lucide-react';

interface Mensaje {
  id: string;
  contenido: string;
  rol: 'USER' | 'ASSISTANT' | 'SYSTEM';
  timestamp: Date;
  metadatos?: any;
}

interface Conversacion {
  id: string;
  titulo: string;
  contexto?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  mensajes: Mensaje[];
  _count: {
    mensajes: number;
  };
}

interface ConversacionDetalle extends Conversacion {
  mensajes: Mensaje[];
}

export default function HistorialConversaciones() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState<ConversacionDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadConversaciones();
  }, [currentPage]);

  const loadConversaciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/conversations?page=${currentPage}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setConversaciones(data.data.conversaciones);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversacionDetalle = async (id: string) => {
    try {
      setLoadingDetalle(true);
      const response = await fetch(`/api/conversations/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setConversacionSeleccionada(data.data);
      }
    } catch (error) {
      console.error('Error cargando detalle de conversación:', error);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const deleteConversacion = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
      return;
    }

    try {
      const response = await fetch(`/api/conversations?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setConversaciones(prev => prev.filter(c => c.id !== id));
        if (conversacionSeleccionada?.id === id) {
          setConversacionSeleccionada(null);
        }
      }
    } catch (error) {
      console.error('Error eliminando conversación:', error);
    }
  };

  const filteredConversaciones = conversaciones.filter(conv =>
    conv.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.mensajes.some(msg => 
      msg.contenido.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial de Conversaciones
          </h1>
          <p className="text-gray-600">
            Revisa todas las conversaciones con ContadorIA para referencias futuras y análisis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Conversaciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar conversaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Cargando conversaciones...
                  </div>
                ) : filteredConversaciones.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No se encontraron conversaciones
                  </div>
                ) : (
                  filteredConversaciones.map((conversacion) => (
                    <div
                      key={conversacion.id}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        conversacionSeleccionada?.id === conversacion.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => loadConversacionDetalle(conversacion.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conversacion.titulo}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {conversacion._count.mensajes} mensajes
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(conversacion.fechaActualizacion)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              loadConversacionDetalle(conversacion.id);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Ver conversación"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversacion(conversacion.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Eliminar conversación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detalle de Conversación */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              {loadingDetalle ? (
                <div className="p-8 text-center text-gray-500">
                  Cargando conversación...
                </div>
              ) : conversacionSeleccionada ? (
                <>
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {conversacionSeleccionada.titulo}
                    </h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Creada: {formatDate(conversacionSeleccionada.fechaCreacion)}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {conversacionSeleccionada.mensajes.length} mensajes
                      </div>
                    </div>
                  </div>

                  <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {conversacionSeleccionada.mensajes.map((mensaje) => (
                        <div
                          key={mensaje.id}
                          className={`flex ${mensaje.rol === 'USER' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              mensaje.rol === 'USER'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{mensaje.contenido}</p>
                            <p className={`text-xs mt-1 ${
                              mensaje.rol === 'USER' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatDate(mensaje.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Selecciona una conversación para ver los detalles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}