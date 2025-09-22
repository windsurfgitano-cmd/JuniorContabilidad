'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Hook para lazy loading de imágenes
export function useImageLazyLoading() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
    }, []);

  return { isLoaded, isInView, setIsLoaded, imgRef };
}

// Componente de imagen optimizada
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiNjY2MiPkNhcmdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==',
  priority = false 
}: OptimizedImageProps) {
  const { isLoaded, isInView, setIsLoaded, imgRef } = useImageLazyLoading();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder mientras carga */}
      {!isLoaded && (
        <Image
          src={placeholder}
          alt=""
          fill
          className="object-cover blur-sm"
        />
      )}
      
      {/* Imagen principal */}
      {(isInView || priority) && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
      
      {/* Indicador de carga */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
}

// Hook para detectar conexión lenta
export function useNetworkStatus() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // @ts-expect-error - Navigator connection API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const updateConnectionInfo = () => {
        setConnectionType(connection.effectiveType || 'unknown');
        setIsSlowConnection(
          connection.effectiveType === 'slow-2g' || 
          connection.effectiveType === '2g' ||
          connection.downlink < 1.5
        );
      };

      updateConnectionInfo();
      connection.addEventListener('change', updateConnectionInfo);

      return () => {
        connection.removeEventListener('change', updateConnectionInfo);
      };
    }
  }, []);

  return { isSlowConnection, connectionType };
}

// Componente de carga progresiva
interface ProgressiveLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

export function ProgressiveLoading({ 
  children, 
  fallback = <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>,
  delay = 0 
}: ProgressiveLoadingProps) {
  const [shouldLoad, setShouldLoad] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldLoad(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldLoad) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Hook para optimización de recursos críticos
export function useCriticalResourcePreload(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;
    // Precargar fuentes críticas
    const criticalFonts = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-var-latin.woff2'
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Precargar CSS crítico
    const criticalCSS = [
      '/styles/critical.css'
    ];

    criticalCSS.forEach(css => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = css;
      link.as = 'style';
      document.head.appendChild(link);
    });

    // Prefetch de rutas importantes
    const importantRoutes = [
      '/clientes',
      '/obligaciones',
      '/asistente-ia'
    ];

    importantRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, [enabled]);
}

// Componente principal de optimización
interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enablePreloading?: boolean;
}

export default function PerformanceOptimizer({ 
  children, 
  enablePreloading = true
}: PerformanceOptimizerProps) {
  const { isSlowConnection } = useNetworkStatus();

  // Aplicar preloading solo si está habilitado
  useCriticalResourcePreload(enablePreloading);

  // Configurar estrategias según la conexión
  useEffect(() => {
    if (isSlowConnection) {
      // Reducir calidad de imágenes en conexiones lentas
      document.documentElement.style.setProperty('--image-quality', '0.7');
      
      // Deshabilitar animaciones costosas
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.setProperty('--image-quality', '1');
      document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }
  }, [isSlowConnection]);

  return (
    <div className="performance-optimized">
      {/* Indicador de conexión lenta */}
      {isSlowConnection && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800 text-center z-50">
          Conexión lenta detectada. Optimizando experiencia...
        </div>
      )}
      
      {children}
    </div>
  );
}