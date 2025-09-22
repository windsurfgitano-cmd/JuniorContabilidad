'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, Send, Mic, Paperclip } from 'lucide-react';
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [includeContext, setIncludeContext] = useState({
    clients: true,
    obligations: true,
    tasks: true,
    capabilities: true
  });
  const [isContextMenuCollapsed, setIsContextMenuCollapsed] = useState(true);
  const [ejemploActual, setEjemploActual] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [stats, setStats] = useState<AIStats | null>(null);

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


  const [isMobile, setIsMobile] = useState(false);

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
    // Comentado para evitar re-renders que afecten el input
    // setMessages(prevMessages => 
    //   prevMessages.map(msg => 
    //     msg.id === '1' ? { ...msg, timestamp: new Date() } : msg
    //   )
    // );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          messages: messages,
          conversationId: conversationId,
          context: {
            includeClients: includeContext.clients,
            includeObligaciones: includeContext.obligations,
            includeTareas: includeContext.tasks,
            includeCapabilities: includeContext.capabilities
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      
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
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
    <div className="flex flex-col h-full bg-white">
      {/* Messages area - Fixed height to prevent overlap */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`overflow-y-auto bg-slate-50 ${
          isMobile ? 'p-3 space-y-3' : 'p-4 space-y-4'
        }`}
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          height: 'calc(100vh - 140px)',
          maxHeight: 'calc(100vh - 140px)',
          minHeight: '200px',
          paddingBottom: '20px'
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

      {/* Input area - Fixed at bottom with improved design */}
      <div 
        className="border-t bg-white shadow-lg" 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: 'white',
          borderTop: '1px solid #e5e7eb',
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="max-w-full mx-auto px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="¿En qué puedo ayudarte hoy?"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 pr-14 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                style={{
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  minHeight: '48px'
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                style={{
                  minWidth: '44px',
                  minHeight: '44px'
                }}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
          
          <div 
            className="text-xs mt-2 text-center font-medium"
            style={{
              color: '#000000',
              opacity: 0.7
            }}
          >
            Presiona Enter para enviar • Shift+Enter para nueva línea • 📚 Capacidades Completas activadas
          </div>
        </div>
      </div>
    </div>
  );
}