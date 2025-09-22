'use client';

import AIAssistant from '@/components/AIAssistant';
import { Rocket, MessageCircle, Lightbulb, CheckCircle, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import useTouchOptimization from '@/hooks/useTouchOptimization';

export default function AsistenteIAPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { triggerHapticFeedback } = useTouchOptimization({
    enableHapticFeedback: true,
    preventZoom: true,
    optimizeScrolling: true
  });

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    triggerHapticFeedback('light');
  };

  const handleExampleClick = (example: string) => {
    triggerHapticFeedback('medium');
    // Aquí se podría integrar con el AIAssistant para cargar el ejemplo
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header móvil */}
      <div className="lg:hidden flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 rounded-full flex items-center justify-center w-8 h-8">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-gray-900">ContadorIA</h1>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500">En línea</span>
            </div>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex flex-1 relative">
        {/* Panel principal del chat - Mobile First */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Contenedor del chat - Ocupa toda la altura disponible */}
          <div className="flex-1 bg-white overflow-hidden">
            <AIAssistant />
          </div>
        </div>

        {/* Sidebar - Adaptativo */}
        <div className={`
          ${isMobile ? 'fixed inset-y-0 right-0 z-50' : 'relative'}
          ${isMobile && !isSidebarOpen ? 'translate-x-full' : 'translate-x-0'}
          w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isMobile ? 'shadow-xl' : ''}
          lg:translate-x-0 lg:w-80 xl:w-96
        `}>
          {/* Overlay para móvil */}
          {isMobile && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleSidebar}
            />
          )}

          {/* Contenido del sidebar */}
          <div className="h-full overflow-y-auto relative z-50 bg-white">
            {/* Header del sidebar móvil */}
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Información</h2>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="p-4 space-y-6">
              {/* Capacidades */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-blue-600" />
                  Capacidades
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {[
                    'Análisis tributario completo',
                    'Gestión de obligaciones',
                    'Seguimiento de tareas',
                    'Insights financieros',
                    'Optimización tributaria',
                    'Preparación auditorías'
                  ].map((capability, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ejemplos de consultas */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  Ejemplos Rápidos
                </h3>
                <div className="space-y-2">
                  {[
                    '¿Qué obligaciones vencen esta semana?',
                    'Analiza la situación tributaria de [cliente]',
                    'Crea una tarea para revisar F22',
                    '¿Qué beneficios tributarios aplican?'
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="w-full p-3 text-left bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-gray-200 hover:border-blue-200 touch-manipulation group"
                      style={{ minHeight: '44px' }}
                    >
                      <span className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors">
                        &quot;{example}&quot;
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip profesional */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-bold text-amber-900 mb-2 text-base flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  Tip Profesional
                </h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  ContadorIA puede acceder y modificar tu base de datos. Siempre revisa las acciones importantes antes de confirmar.
                </p>
              </div>

              {/* Estado de conexión */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">
                    Conectado y listo
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Acceso completo a tu información contable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}