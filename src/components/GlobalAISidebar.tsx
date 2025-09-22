'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Info } from 'lucide-react';
import { usePageContext } from '@/contexts/PageContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function GlobalAISidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentPage, pageTitle, pageDescription, contextualHelp } = usePageContext();

  useEffect(() => {
    // Mensaje inicial contextual basado en la página
    if (messages.length === 0) {
      const initialMessage = `¡Hola! Estoy aquí para ayudarte con ${pageTitle}. ${pageDescription}. ¿En qué puedo asistirte?`;
      
      setMessages([{
        id: '1',
        content: initialMessage,
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, [currentPage, messages.length, pageTitle, pageDescription]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          messages: messages, // Enviar historial completo
          conversationId: conversationId, // ID de conversación para persistencia
          context: {
            currentPage: currentPage,
            pageTitle: pageTitle,
            pageDescription: pageDescription,
            contextualHelp: contextualHelp,
            previousMessages: messages.slice(-5) // Últimos 5 mensajes para contexto
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const getInitialMessage = () => {
    if (messages.length === 0) {
      return `¡Hola! Soy ContadorIA, tu asistente experto en contabilidad chilena. 

Veo que estás en: **${currentPage}**

¿En qué puedo ayudarte con esta sección? Puedo:
• Analizar la información que estás viendo
• Crear tareas relacionadas con esta página
• Explicar procesos contables específicos
• Revisar obligaciones tributarias
• Y mucho más...

¿Qué necesitas?`;
    }
    return null;
  };

  return (
    <>
      {/* Botón flotante para abrir sidebar */}
      <button
        onClick={toggleSidebar}
        className={`fixed right-6 bottom-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${
          isOpen ? 'rotate-45 pointer-events-none opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Abrir asistente ContadorIA"
        title="Abrir ContadorIA"
      >
        {isOpen ? (
          <span className="text-2xl">×</span>
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-lg">ContadorIA</h3>
                  <p className="text-xs text-white opacity-95">{pageTitle}</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            
            {/* Contexto actual */}
            <div className="mt-3 p-2 bg-white bg-opacity-10 rounded-lg">
              <p className="text-xs text-white opacity-95">Contexto actual:</p>
              <p className="text-sm font-medium">{currentPage}</p>
            </div>
          </div>

          {/* Ayuda contextual */}
          {contextualHelp.length > 0 && (
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Puedes preguntar sobre:</span>
              </div>
              <ul className="text-xs text-blue-700 space-y-1">
                {contextualHelp.map((help, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{help}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Mensaje inicial */}
            {getInitialMessage() && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-900 whitespace-pre-line">
                  {getInitialMessage()}
                </div>
              </div>
            )}

            {/* Mensajes del chat */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <User className="w-4 h-4 text-white mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed whitespace-pre-line">{message.content}</div>
                      <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-800'}`}>
                        {message.timestamp.toLocaleTimeString('es-CL', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          second: '2-digit',
                          hour12: false 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Indicador de carga */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Área de entrada */}
          <div className="border-t bg-white p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Pregunta sobre ${pageTitle.toLowerCase()}...`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-md hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-800 text-center">
                Pregunta específicamente sobre esta página
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}