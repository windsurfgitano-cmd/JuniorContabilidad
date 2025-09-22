'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  User,
  Building,
  FileText,
  ArrowRight,
  Star
} from 'lucide-react';
import useTouchOptimization from '@/hooks/useTouchOptimization';
import MobileNavigation from '@/components/MobileNavigation';
import PerformanceOptimizer, { OptimizedImage, ProgressiveLoading } from '@/components/PerformanceOptimizer';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  asunto: string;
  mensaje: string;
  tipoConsulta: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactoPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    asunto: '',
    mensaje: '',
    tipoConsulta: 'general'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  // Optimizaciones táctiles
  const { triggerHapticFeedback, handleDoubleTap, handleLongPress } = useTouchOptimization({
    enableHapticFeedback: true,
    preventZoom: true,
    optimizeScrolling: true
  });

  // Validación en tiempo real
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'nombre':
        return value.length < 2 ? 'El nombre debe tener al menos 2 caracteres' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Ingresa un email válido' : '';
      case 'telefono':
        const phoneRegex = /^(\+56)?[0-9]{8,9}$/;
        return value && !phoneRegex.test(value.replace(/\s/g, '')) ? 'Formato: +56912345678 o 912345678' : '';
      case 'mensaje':
        return value.length < 10 ? 'El mensaje debe tener al menos 10 caracteres' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Feedback háptico sutil al escribir
    if (value.length > 0 && formData[name as keyof FormData].length === 0) {
      triggerHapticFeedback('light');
    }
    
    // Validación en tiempo real
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Feedback háptico al enviar
    triggerHapticFeedback('medium');

    // Validación completa
    const newErrors: FormErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'telefono' && key !== 'empresa') { // Campos opcionales
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      // Feedback háptico de error
      triggerHapticFeedback('heavy');
      return;
    }

    // Simular envío
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      // Feedback háptico de éxito
      triggerHapticFeedback('medium');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        asunto: '',
        mensaje: '',
        tipoConsulta: 'general'
      });
    } catch (error) {
      console.error('Error al enviar:', error);
      triggerHapticFeedback('heavy');
    } finally {
      setIsSubmitting(false);
    }
  };

  const consultaTypes = [
    { value: 'general', label: 'Consulta General', icon: MessageCircle },
    { value: 'tributaria', label: 'Asesoría Tributaria', icon: FileText },
    { value: 'contable', label: 'Servicios Contables', icon: Building },
    { value: 'auditoria', label: 'Auditoría', icon: CheckCircle }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Mensaje Enviado!</h2>
          <p className="text-gray-600 mb-8">
            Gracias por contactarnos. Te responderemos dentro de las próximas 24 horas.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Enviar Otro Mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50">
      {/* Header Mobile-First */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Contáctanos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte con todas tus necesidades contables y tributarias
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Información de Contacto - Mobile First */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Tarjeta de Contacto Rápido */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                Contacto Directo
              </h3>
              
              <div className="space-y-4">
                <a 
                  href="tel:+56912345678" 
                  className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Llamar Ahora</p>
                    <p className="text-emerald-600 font-medium">+56 9 1234 5678</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-emerald-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </a>

                <a 
                  href="mailto:contacto@tucontable.cl" 
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-blue-600 font-medium">contacto@tucontable.cl</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Información</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ubicación</p>
                    <p className="text-gray-600">Av. Providencia 123, Santiago, Chile</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Horarios</p>
                    <p className="text-gray-600">Lun - Vie: 9:00 - 18:00</p>
                    <p className="text-gray-600">Sáb: 9:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonios Rápidos */}
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-300" />
                ))}
              </div>
              <p className="text-emerald-50 mb-4 italic">
                "Excelente servicio y atención personalizada. Muy recomendado para empresas."
              </p>
              <p className="text-emerald-100 font-semibold">- María González, CEO</p>
            </div>
          </div>

          {/* Formulario Principal - Mobile Optimized */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              
              {/* Header del Formulario */}
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Envíanos tu Consulta</h2>
                <p className="text-emerald-100">Te responderemos en menos de 24 horas</p>
              </div>

              {/* Tipos de Consulta - Mobile Friendly */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Consulta</h3>
                <div className="grid grid-cols-2 gap-3">
                  {consultaTypes.map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                      <button
                        key={tipo.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tipoConsulta: tipo.value }))}
                        className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                          formData.tipoConsulta === tipo.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium text-center">{tipo.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Formulario */}
              <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('nombre')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-4 border-2 rounded-2xl text-lg transition-all duration-200 ${
                        errors.nombre 
                          ? 'border-red-300 bg-red-50' 
                          : focusedField === 'nombre'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Tu nombre completo"
                    />
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {errors.nombre && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nombre}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-4 border-2 rounded-2xl text-lg transition-all duration-200 ${
                        errors.email 
                          ? 'border-red-300 bg-red-50' 
                          : focusedField === 'email'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Teléfono y Empresa en Grid Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('telefono')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-4 border-2 rounded-2xl text-lg transition-all duration-200 ${
                          errors.telefono 
                            ? 'border-red-300 bg-red-50' 
                            : focusedField === 'telefono'
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="+56 9 1234 5678"
                      />
                      <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.telefono && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.telefono}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Empresa
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('empresa')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-4 border-2 rounded-2xl text-lg transition-all duration-200 ${
                          focusedField === 'empresa'
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Tu empresa (opcional)"
                      />
                      <Building className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Asunto */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('asunto')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 border-2 rounded-2xl text-lg transition-all duration-200 ${
                      errors.asunto 
                        ? 'border-red-300 bg-red-50' 
                        : focusedField === 'asunto'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="¿En qué podemos ayudarte?"
                  />
                  {errors.asunto && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.asunto}
                    </p>
                  )}
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('mensaje')}
                    onBlur={() => setFocusedField(null)}
                    rows={6}
                    className={`w-full px-4 py-4 border-2 rounded-2xl text-lg transition-all duration-200 resize-none ${
                      errors.mensaje 
                        ? 'border-red-300 bg-red-50' 
                        : focusedField === 'mensaje'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Describe tu consulta con el mayor detalle posible..."
                  />
                  {errors.mensaje && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.mensaje}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.mensaje.length}/500 caracteres
                  </p>
                </div>

                {/* Botón de Envío - Mobile Optimized */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-emerald-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Send className="w-6 h-6" />
                      Enviar Mensaje
                    </div>
                  )}
                </button>

                {/* Nota de Privacidad */}
                <p className="text-sm text-gray-500 text-center">
                  Al enviar este formulario, aceptas nuestra política de privacidad. 
                  Tus datos están protegidos y no serán compartidos con terceros.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}