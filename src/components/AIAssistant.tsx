'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mensaje inicial contextual
    const initialMessage = `¡Hola! Soy ContadorIA, tu asistente experto en contabilidad chilena. 

Puedes preguntarme sobre:
• Análisis de información contable
• Creación de tareas relacionadas
• Explicación de procesos contables
• Revisión de obligaciones tributarias
• Interpretación de normativas contables
• Cálculos tributarios y financieros

¿En qué puedo ayudarte hoy?`;
    
    setMessages([{
      id: '1',
      content: initialMessage,
      role: 'assistant',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
          messages: messages,
          conversationId: conversationId,
          context: {
            currentPage: 'asistente-ia',
            pageTitle: 'Asistente IA',
            pageDescription: 'Chat con ContadorIA',
            contextualHelp: [],
            previousMessages: messages.slice(-5)
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

  return (
    <div className="flex flex-col h-screen relative">
      {/* Área de mensajes con padding bottom para el input fijo */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100"
        style={{ paddingBottom: '160px', height: '100vh' }}
      >
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
                  : 'bg-white text-black border border-gray-200'
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
                  <div className="flex items-center mb-1">
                    <span className={`text-sm font-black ${
                      message.role === 'user' ? 'text-white' : 'text-black'
                    }`}>
                      {message.role === 'user' ? 'Tú' : 'ContadorIA'}
                    </span>
                  </div>
                  <div className={`text-sm leading-relaxed whitespace-pre-line font-medium ${
                    message.role === 'user' ? 'text-white' : 'text-black'
                  }`}>{message.content}</div>
                  <div className={`text-xs mt-2 font-medium ${message.role === 'user' ? 'text-blue-100' : 'text-black'}`}>
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

      {/* Input fijo en la parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pregunta sobre contabilidad..."
              className="w-full border border-gray-300 rounded-lg px-3 py-3 pr-12 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
          <div className="text-xs text-black font-medium text-center">
            Pregunta específicamente sobre contabilidad
          </div>
        </form>
      </div>
    </div>
  );
}