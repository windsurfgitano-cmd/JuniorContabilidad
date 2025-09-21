'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageContextType {
  currentPage: string;
  pageTitle: string;
  pageDescription: string;
  contextualHelp: string[];
}

const PageContext = createContext<PageContextType | undefined>(undefined);

const pageConfig: Record<string, Omit<PageContextType, 'currentPage'>> = {
  '/': {
    pageTitle: 'Dashboard Principal',
    pageDescription: 'Vista general de tu gestión contable',
    contextualHelp: [
      'Aquí puedes ver un resumen de tus obligaciones fiscales',
      'Revisa las tareas pendientes y próximos vencimientos',
      'Accede rápidamente a las funciones más utilizadas'
    ]
  },
  '/asistente': {
    pageTitle: 'ContadorIA - Asistente Inteligente',
    pageDescription: 'Tu asistente experto en contabilidad y tributación',
    contextualHelp: [
      'Pregunta sobre obligaciones fiscales y tributarias',
      'Consulta sobre procedimientos contables',
      'Solicita ayuda con declaraciones y formularios',
      'Obtén información sobre normativas vigentes'
    ]
  },
  '/obligaciones': {
    pageTitle: 'Obligaciones Fiscales',
    pageDescription: 'Gestión de obligaciones tributarias y vencimientos',
    contextualHelp: [
      'Revisa las obligaciones pendientes por vencer',
      'Consulta el calendario fiscal actualizado',
      'Gestiona el cumplimiento de declaraciones',
      'Configura recordatorios automáticos'
    ]
  },
  '/tareas': {
    pageTitle: 'Gestión de Tareas',
    pageDescription: 'Organiza y controla tus tareas contables',
    contextualHelp: [
      'Crea y asigna tareas contables',
      'Establece prioridades y fechas límite',
      'Haz seguimiento del progreso',
      'Colabora con tu equipo de trabajo'
    ]
  },
  '/clientes': {
    pageTitle: 'Gestión de Clientes',
    pageDescription: 'Administra la información de tus clientes',
    contextualHelp: [
      'Registra nuevos clientes y sus datos fiscales',
      'Actualiza información de contacto',
      'Gestiona documentos por cliente',
      'Revisa el historial de servicios'
    ]
  },
  '/reportes': {
    pageTitle: 'Reportes y Análisis',
    pageDescription: 'Genera reportes y análisis contables',
    contextualHelp: [
      'Genera reportes financieros personalizados',
      'Analiza tendencias y métricas clave',
      'Exporta datos en diferentes formatos',
      'Programa reportes automáticos'
    ]
  }
};

export function PageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pageContext, setPageContext] = useState<PageContextType>({
    currentPage: '/',
    pageTitle: 'TuContable',
    pageDescription: 'Plataforma de gestión contable',
    contextualHelp: []
  });

  useEffect(() => {
    const config = pageConfig[pathname] || pageConfig['/'];
    setPageContext({
      currentPage: pathname,
      ...config
    });
  }, [pathname]);

  return (
    <PageContext.Provider value={pageContext}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
}