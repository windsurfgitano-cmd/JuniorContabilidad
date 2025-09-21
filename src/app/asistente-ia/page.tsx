import AIAssistant from '@/components/AIAssistant';
import { Rocket, MessageCircle, Lightbulb, CheckCircle } from 'lucide-react';

export default function AsistenteIAPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            ContadorIA - Asistente Inteligente
          </h1>
          <p className="text-lg text-gray-600">
            Tu asistente experto en contabilidad y tributación chilena con acceso completo a tu información
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Panel principal del chat */}
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <AIAssistant />
            </div>
          </div>
          
          {/* Panel lateral con información */}
          <div className="lg:col-span-1 xl:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                Capacidades de ContadorIA
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Análisis completo de situación tributaria</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Gestión automática de obligaciones</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Creación y seguimiento de tareas</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Insights financieros avanzados</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Optimización tributaria legal</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Preparación para auditorías</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                Ejemplos de Consultas
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-100">
                  <span className="text-sm text-gray-700">"¿Qué obligaciones vencen esta semana?"</span>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-100">
                  <span className="text-sm text-gray-700">"Analiza la situación tributaria de [cliente]"</span>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg cursor-pointer hover:from-purple-100 hover:to-violet-100 transition-all duration-200 border border-purple-100">
                  <span className="text-sm text-gray-700">"Crea una tarea para revisar F22 de enero"</span>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg cursor-pointer hover:from-orange-100 hover:to-amber-100 transition-all duration-200 border border-orange-100">
                  <span className="text-sm text-gray-700">"¿Qué beneficios tributarios aplican?"</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Tip Profesional
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                ContadorIA puede acceder y modificar tu base de datos. Siempre revisa las acciones importantes antes de confirmar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}