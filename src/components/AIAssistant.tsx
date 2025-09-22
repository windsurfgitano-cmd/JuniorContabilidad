'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Mic, Paperclip, MoreVertical } from 'lucide-react';
import useTouchOptimization from '@/hooks/useTouchOptimization';

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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [includeContext, setIncludeContext] = useState({
    clients: true,
    obligations: true,
    tasks: true,
    capabilities: true
  });
  const [isContextMenuCollapsed, setIsContextMenuCollapsed] = useState(true);

  // Lista extensa de ejemplos para rotación
  const ejemplosConsultas = [
    // Comandos básicos
    "Valida el RUT 12.345.678-9",
    "Calcula el IVA de $100.000",
    "¿Cuánto es la retención de honorarios para $500.000?",
    "Calcula el IVA incluido en $119.000",
    "Valida si el RUT 96790240-3 es correcto",
    
    // Comandos intermedios
    "Convierte 1000 UF a pesos chilenos",
    "¿Cuántas UF son $50.000.000?",
    "¿Cuándo vence el F29 para el RUT 12345678-5?",
    "Convierte 500 UF a pesos con fecha actual",
    "¿Qué día vence mi F29 si mi RUT termina en 7?",
    
    // Comandos avanzados SII
    "Consulta el estado SII del RUT 96790240-3",
    "Verifica si el RUT 12345678-9 puede emitir boletas",
    "¿Está activo en el SII el RUT 76.123.456-7?",
    "Consulta la información completa de la empresa 96790240-3",
    
    // Comandos combinados
    "Valida el RUT 12345678-9 y consulta su estado en el SII",
    "Calcula el IVA de $250.000 y la retención de honorarios",
    "Convierte 100 UF a pesos y calcula el IVA",
    "¿Cuándo vence el F29 para 87654321-0 y está autorizado para boletas?",
    
    // Consultas de análisis
    "Muestra un resumen de todos mis clientes activos",
    "¿Qué obligaciones tengo pendientes esta semana?",
    "Lista las tareas más urgentes",
    "¿Cuáles son los próximos vencimientos importantes?",
    
    // Consultas específicas de contabilidad
    "¿Cómo calculo la retención de construcción?",
    "Explícame las diferencias entre IVA débito y crédito",
    "¿Qué documentos necesito para una auditoría?",
    "¿Cuáles son las fechas clave del calendario tributario?",
    
    // Consultas de optimización
    "¿Cómo puedo optimizar mis procesos contables?",
    "Sugiere mejoras para mi gestión tributaria",
    "¿Qué tareas puedo automatizar?",
    "Analiza mi cartera de clientes",
    
    // Consultas de cumplimiento
    "¿Estoy al día con todas mis obligaciones?",
    "¿Qué formularios debo presentar este mes?",
    "Revisa el estado de cumplimiento de mis clientes",
    "¿Hay alguna multa o sanción pendiente?",
    
    // Consultas de planificación
    "¿Qué debo preparar para fin de año?",
    "Planifica mis obligaciones del próximo trimestre",
    "¿Cuándo debo renovar mis certificados digitales?",
    "¿Qué cambios normativos debo considerar?"
  ];

  const [ejemploActual, setEjemploActual] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Touch optimization
  const { triggerHapticFeedback } = useTouchOptimization({
    enableHapticFeedback: true,
    preventZoom: true,
    optimizeScrolling: true
  });

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Rotación automática de ejemplos cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setEjemploActual(prev => (prev + 1) % ejemplosConsultas.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [ejemplosConsultas.length]);

  const [ejemploSeleccionado, setEjemploSeleccionado] = useState<string | null>(null);

  // Función para cargar ejemplo al chat con animación
  const cargarEjemplo = (ejemplo: string) => {
    setEjemploSeleccionado(ejemplo);
    setInputMessage(ejemplo);
    inputRef.current?.focus();
    
    // Limpiar la animación después de 600ms
    setTimeout(() => {
      setEjemploSeleccionado(null);
    }, 600);
  };
  
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

  // Auto-scroll inteligente al agregar mensajes
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      // Scroll suave al final cuando se agrega un nuevo mensaje
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      };
      
      // Pequeño delay para asegurar que el DOM se haya actualizado
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  // Scroll al enviar mensaje (comportamiento inmediato)
  const scrollToBottomImmediate = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'auto',
        block: 'end'
      });
    }
  };

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

    // Scroll inmediato al enviar mensaje del usuario
    scrollToBottomImmediate();

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          messages: messages, // Enviar historial completo
          conversationId: conversationId, // ID de conversación para persistencia
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
        // Actualizar conversationId si se devuelve uno nuevo
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId);
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
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
    <div className="flex flex-col h-full bg-white overflow-hidden">




      {/* Messages area - Optimized for readability */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto bg-slate-50 ${
          isMobile ? 'p-3 space-y-3' : 'p-4 space-y-4'
        }`}
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          height: '0',
          minHeight: '0'
        }}
      >
        {messages.filter(message => message && message.content && typeof message.content === 'string').map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`${
                isMobile ? 'max-w-[85%]' : 'max-w-2xl'
              } ${
                isMobile ? 'px-3 py-2' : 'px-4 py-3'
              } rounded-2xl shadow-sm transition-all duration-200 ${
                message.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}
              style={{
                // Optimizaciones para touch
                touchAction: 'pan-y',
                userSelect: 'text',
                WebkitUserSelect: 'text'
              }}
            >
              <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
                {message.role === 'assistant' && (
                  <Bot className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} mt-1 flex-shrink-0 text-slate-600`} />
                )}
                {message.role === 'user' && (
                  <User className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} mt-1 flex-shrink-0 text-emerald-100`} />
                )}
                <div className="flex-1 min-w-0">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(message.content)
                    }}
                    className={`whitespace-pre-wrap leading-relaxed ${
                      isMobile ? 'text-sm' : 'text-base'
                    }`}
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  />
                  <div className={`${
                    isMobile ? 'text-xs mt-1' : 'text-xs mt-2'
                  } font-medium ${
                    message.role === 'user' ? 'text-emerald-200' : 'text-slate-500'
                  }`}>
                    {isHydrated ? message.timestamp.toLocaleTimeString('es-CL', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      ...(isMobile ? {} : { second: '2-digit' }),
                      hour12: false 
                    }) : '00:00'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className={`bg-white text-slate-800 rounded-2xl shadow-md border border-slate-200 ${
              isMobile ? 'px-4 py-3' : 'px-6 py-4'
            }`}>
              <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {isMobile ? 'Analizando...' : 'ContadorIA está analizando...'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Área de entrada - Fija en la parte inferior */}
      <div className={`flex-shrink-0 border-t border-slate-200 bg-slate-50 shadow-sm ${isMobile ? 'p-4' : 'p-8'}`}>
        {/* Menú de contexto colapsable - Compacto */}
        {!isContextMenuCollapsed && (
          <div className={`mb-3 bg-white rounded-lg border border-slate-300 shadow-sm ${isMobile ? 'mb-2' : ''}`}>
            <div className={`p-3 ${isMobile ? 'p-2' : ''}`}>
              <div className={`grid grid-cols-2 gap-2 ${isMobile ? 'gap-2' : 'gap-3'}`}>
                <label className={`flex items-center space-x-2 cursor-pointer touch-manipulation p-2 rounded hover:bg-slate-50 transition-colors ${isMobile ? 'text-sm p-1.5' : 'text-sm'}`}>
                  <input
                    type="checkbox"
                    checked={includeContext.clients}
                    onChange={(e) => {
                      triggerHapticFeedback();
                      setIncludeContext(prev => ({ ...prev, clients: e.target.checked }));
                    }}
                    className={`rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 focus:ring-2 ${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`}
                  />
                  <span className="text-slate-800 font-medium">Clientes</span>
                </label>
                <label className={`flex items-center space-x-2 cursor-pointer touch-manipulation p-2 rounded hover:bg-slate-50 transition-colors ${isMobile ? 'text-sm p-1.5' : 'text-sm'}`}>
                  <input
                    type="checkbox"
                    checked={includeContext.obligations}
                    onChange={(e) => {
                      triggerHapticFeedback();
                      setIncludeContext(prev => ({ ...prev, obligations: e.target.checked }));
                    }}
                    className={`rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 focus:ring-2 ${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`}
                  />
                  <span className="text-slate-800 font-medium">Obligaciones</span>
                </label>
                <label className={`flex items-center space-x-2 cursor-pointer touch-manipulation p-2 rounded hover:bg-slate-50 transition-colors ${isMobile ? 'text-sm p-1.5' : 'text-sm'}`}>
                  <input
                    type="checkbox"
                    checked={includeContext.tasks}
                    onChange={(e) => {
                      triggerHapticFeedback();
                      setIncludeContext(prev => ({ ...prev, tasks: e.target.checked }));
                    }}
                    className={`rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 focus:ring-2 ${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`}
                  />
                  <span className="text-slate-800 font-medium">Tareas</span>
                </label>
                <label className={`flex items-center space-x-2 cursor-pointer touch-manipulation p-2 rounded hover:bg-slate-50 transition-colors ${isMobile ? 'text-sm p-1.5' : 'text-sm'}`}>
                  <input
                    type="checkbox"
                    checked={includeContext.capabilities}
                    onChange={(e) => {
                      triggerHapticFeedback();
                      setIncludeContext(prev => ({ ...prev, capabilities: e.target.checked }));
                    }}
                    className={`rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 focus:ring-2 ${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`}
                  />
                  <span className="text-slate-800 font-medium">Capacidades</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Input area - Mobile optimized */}
        <div className="flex items-end space-x-2 md:space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              onFocus={() => {
                setIsInputFocused(true);
                triggerHapticFeedback('light');
              }}
              onBlur={() => setIsInputFocused(false)}
              placeholder={isMobile ? "Pregúntame algo..." : "¿En qué puedo ayudarte hoy?"}
              className={`
                w-full border border-slate-300 rounded-xl px-4 py-3 md:px-6 md:py-4 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                text-base bg-white text-slate-800 placeholder-slate-400 shadow-sm
                transition-all duration-200 touch-manipulation resize-none
                ${isInputFocused ? 'shadow-lg' : ''}
                ${isMobile ? 'text-16px pr-36' : ''}
              `}
              style={{ 
                fontSize: isMobile ? '16px' : '14px', // Prevenir zoom en iOS
                minHeight: '44px', // Tamaño mínimo táctil
                maxHeight: isMobile ? '120px' : '150px'
              }}
              rows={isMobile ? 2 : 3}
              disabled={isLoading}
            />
            
            {/* Botones adicionales para móvil */}
            {isMobile && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                {/* Botón de contexto */}
                <button
                  onClick={() => {
                    setIsContextMenuCollapsed(!isContextMenuCollapsed);
                    triggerHapticFeedback();
                  }}
                  className={`p-2 transition-colors touch-manipulation rounded-lg ${
                    Object.values(includeContext).some(v => v) 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  style={{ minHeight: '44px', minWidth: '44px' }}
                  title="Contexto"
                >
                  <div className="relative">
                    <div className="w-4 h-4 border-2 border-current rounded opacity-70"></div>
                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full text-xs ${
                      Object.values(includeContext).some(v => v) ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}></div>
                  </div>
                </button>
                <button
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors touch-manipulation"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                  title="Adjuntar archivo"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors touch-manipulation"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                  title="Mensaje de voz"
                >
                  <Mic size={18} />
                </button>
              </div>
            )}
          </div>
          
          {/* Botones para desktop */}
          {!isMobile && (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setIsContextMenuCollapsed(!isContextMenuCollapsed);
                  triggerHapticFeedback();
                }}
                className={`p-3 transition-colors rounded-xl border ${
                  Object.values(includeContext).some(v => v) 
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                    : 'text-slate-400 hover:text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
                title="Contexto"
              >
                <div className="relative">
                  <div className="w-5 h-5 border-2 border-current rounded opacity-70"></div>
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                    Object.values(includeContext).some(v => v) ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}></div>
                </div>
              </button>
              <button
                className="p-3 text-slate-400 hover:text-slate-600 transition-colors border border-slate-300 rounded-xl hover:bg-slate-50"
                title="Adjuntar archivo"
              >
                <Paperclip size={20} />
              </button>
              <button
                className="p-3 text-slate-400 hover:text-slate-600 transition-colors border border-slate-300 rounded-xl hover:bg-slate-50"
                title="Mensaje de voz"
              >
                <Mic size={20} />
              </button>
            </div>
          )}
          
          <button
            onClick={() => {
              sendMessage();
              triggerHapticFeedback('medium');
            }}
            disabled={isLoading || !inputMessage.trim()}
            className={`
              bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl 
              hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 
              disabled:cursor-not-allowed transition-all duration-200 font-semibold 
              shadow-md border border-emerald-500 touch-manipulation
              ${isMobile ? 'p-3' : 'px-8 py-4'}
            `}
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
            ) : isMobile ? (
              <Send size={20} />
            ) : (
              "Enviar"
            )}
          </button>
        </div>
        


        <div className="text-xs text-slate-600 mt-3 text-center font-medium">
          Presiona Enter para enviar • Shift+Enter para nueva línea • 📚 Capacidades Completas activadas por defecto
        </div>
      </div>
    </div>
  );
}