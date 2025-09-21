'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ProximoVencimiento {
  id: string;
  descripcion: string;
  fecha: string;
  tipo: string;
}

interface AIStats {
  totalClientes: number;
  obligacionesPendientes: number;
  tareasPendientes: number;
  proximosVencimientos: ProximoVencimiento[];
}

export default function AIAssistant() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy ContadorIA, tu asistente experto en contabilidad y tributación chilena. Tengo acceso completo a tu base de datos y puedo ayudarte con:\n\n• Análisis de clientes y su situación tributaria\n• Gestión de obligaciones y vencimientos\n• Creación y seguimiento de tareas\n• Insights financieros y tributarios\n• Optimización de procesos contables\n• Preparación para auditorías\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date('2024-01-01T12:00:00')
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AIStats | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [includeContext, setIncludeContext] = useState({
    clients: true,
    obligations: true,
    tasks: true,
    capabilities: false
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para detectar si el usuario está cerca del final del scroll
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadStats();
  }, []);

  // Auto-scroll al final de los mensajes solo cuando se agrega un nuevo mensaje
  useEffect(() => {
    // Solo hacer scroll si hay más de un mensaje y el auto-scroll está habilitado
    if (messages.length > 1 && shouldAutoScroll) {
      // Usar un pequeño delay para que el DOM se actualice primero
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [messages.length, shouldAutoScroll]);

  // Manejar hidratación y actualizar timestamp del mensaje inicial
  useEffect(() => {
    setIsHydrated(true);
    // Actualizar el timestamp del mensaje inicial con la hora actual
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === '1' ? { ...msg, timestamp: new Date() } : msg
      )
    );
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/ai-assistant');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShouldAutoScroll(true); // Activar auto-scroll cuando se envía un mensaje

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            includeClients: includeContext.clients,
            includeObligaciones: includeContext.obligations,
            includeTareas: includeContext.tasks,
            includeCapabilities: includeContext.capabilities
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Recargar estadísticas después de cada respuesta
        loadStats();
      } else {
        throw new Error(data.error || 'Error en la respuesta del asistente');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Lo siento, ocurrió un error: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor, intenta nuevamente.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Validar que content no sea undefined o null
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    // Remover comandos especiales de la visualización
    const cleanContent = content.replace(/\[AI_COMMAND:[\s\S]*?\][\s\S]*?\[\/AI_COMMAND\]/g, '');
    
    // Formatear texto con markdown básico
    return cleanContent
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-500 bg-opacity-90 rounded-full flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">ContadorIA</h2>
            <div className="flex items-center space-x-2 text-sm text-slate-200">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
              <span>En línea</span>
            </div>
          </div>
        </div>
        
        {stats && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700 bg-opacity-80 rounded-lg p-3 border border-slate-600 shadow-sm">
              <div className="text-2xl font-bold text-white">{stats.totalClientes}</div>
              <div className="text-xs text-slate-200 font-medium">Clientes</div>
            </div>
            <div className="bg-slate-700 bg-opacity-80 rounded-lg p-3 border border-slate-600 shadow-sm">
              <div className="text-2xl font-bold text-white">{stats.tareasPendientes}</div>
              <div className="text-xs text-slate-200 font-medium">Tareas</div>
            </div>
            <div className="bg-slate-700 bg-opacity-80 rounded-lg p-3 border border-slate-600 shadow-sm">
              <div className="text-2xl font-bold text-white">{stats.obligacionesPendientes}</div>
              <div className="text-xs text-slate-200 font-medium">Obligaciones</div>
            </div>
          </div>
        )}
      </div>

      {/* Panel de configuración de contexto */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Incluir en el contexto:</span>
          <div className="flex space-x-6 text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeContext.clients}
                onChange={(e) => setIncludeContext(prev => ({ ...prev, clients: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
              />
              <span className="text-slate-700 font-medium">Clientes</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeContext.obligations}
                onChange={(e) => setIncludeContext(prev => ({ ...prev, obligations: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
              />
              <span className="text-slate-700 font-medium">Obligaciones</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeContext.tasks}
                onChange={(e) => setIncludeContext(prev => ({ ...prev, tasks: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
              />
              <span className="text-slate-700 font-medium">Tareas</span>
            </label>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50"
      >
        {messages.filter(message => message && message.content && typeof message.content === 'string').map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-lg px-6 py-4 rounded-2xl shadow-md ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border border-emerald-500'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                {message.role === 'assistant' && (
                  <Bot className="w-5 h-5 mt-0.5 flex-shrink-0 text-slate-600" />
                )}
                {message.role === 'user' && (
                  <User className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-100" />
                )}
                <div className="flex-1">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(message.content)
                    }}
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                  />
                  <div className={`text-xs mt-2 font-medium ${message.role === 'user' ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {isHydrated ? message.timestamp.toLocaleTimeString('es-CL', { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit',
                      hour12: false 
                    }) : '00:00:00'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-800 px-6 py-4 rounded-2xl shadow-md border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                <span className="text-sm font-medium">ContadorIA está analizando...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Área de entrada */}
      <div className="border-t border-slate-200 bg-slate-50 p-6 shadow-sm">
        {/* Controles de contexto */}
        <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-700 mb-2">Contexto para ContadorIA:</div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={includeContext.clients}
                onChange={(e) => setIncludeContext(prev => ({ ...prev, clients: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-600">Clientes</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={includeContext.obligations}
                onChange={(e) => setIncludeContext(prev => ({ ...prev, obligations: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-600">Obligaciones</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={includeContext.tasks}
                onChange={(e) => setIncludeContext(prev => ({ ...prev, tasks: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-600">Tareas</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={includeContext.capabilities}
                onChange={(e) => setIncludeContext(prev => ({ ...prev, capabilities: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-600 font-medium">📚 Capacidades Completas</span>
            </label>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="¿En qué puedo ayudarte hoy?"
            className="flex-1 border border-slate-300 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white text-slate-800 placeholder-slate-400 shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md border border-emerald-500"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Enviar"
            )}
          </button>
        </div>
        
        <div className="text-xs text-slate-600 mt-3 text-center font-medium">
          Presiona Enter para enviar • Shift+Enter para nueva línea • Activa &quot;Capacidades Completas&quot; para consultas avanzadas
        </div>
      </div>
    </div>
  );
}