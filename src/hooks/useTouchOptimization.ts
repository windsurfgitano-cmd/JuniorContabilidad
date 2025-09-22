import { useEffect, useCallback, useRef } from 'react';

interface TouchOptimizationOptions {
  enableHapticFeedback?: boolean;
  preventZoom?: boolean;
  optimizeScrolling?: boolean;
  touchDelay?: number;
}

interface TouchGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const useTouchOptimization = (options: TouchOptimizationOptions = {}) => {
  const {
    enableHapticFeedback = true,
    preventZoom = true,
    optimizeScrolling = true,
    touchDelay = 300
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTouchRef = useRef<number>(0);

  // Simular feedback háptico en navegadores que lo soporten
  const triggerHapticFeedback = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHapticFeedback) return;

    // Vibration API para Android
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[intensity]);
    }

    // Web Vibration API más avanzada
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      const intensityMap = {
        light: 10,
        medium: 25,
        heavy: 50
      };
      navigator.vibrate(intensityMap[intensity]);
    }
  }, [enableHapticFeedback]);

  // Prevenir zoom accidental en iOS
  const preventZoomHandler = useCallback((e: TouchEvent) => {
    if (!preventZoom) return;
    
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, [preventZoom]);

  // Optimizar el scrolling en móviles
  const optimizeScrollHandler = useCallback((e: TouchEvent) => {
    if (!optimizeScrolling) return;

    const target = e.target as HTMLElement;
    
    // Permitir scroll nativo en elementos scrolleables
    if (target.scrollHeight > target.clientHeight || 
        target.scrollWidth > target.clientWidth) {
      return;
    }

    // Prevenir scroll del body cuando se toca un elemento no scrolleable
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  }, [optimizeScrolling]);

  // Detectar gestos de swipe
  const detectSwipeGesture = useCallback((startTouch: TouchEvent, endTouch: TouchEvent): TouchGesture => {
    const startX = startTouch.touches[0].clientX;
    const startY = startTouch.touches[0].clientY;
    const endX = endTouch.changedTouches[0].clientX;
    const endY = endTouch.changedTouches[0].clientY;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const duration = endTouch.timeStamp - startTouch.timeStamp;
    
    let direction: TouchGesture['direction'] = 'none';
    
    // Determinar dirección del swipe (mínimo 50px de distancia)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else if (Math.abs(deltaY) > 50) {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return {
      startX,
      startY,
      endX,
      endY,
      duration,
      direction
    };
  }, []);

  // Manejar doble tap
  const handleDoubleTap = useCallback((callback: () => void) => {
    return (e: React.TouchEvent) => {
      const now = Date.now();
      const timeSinceLastTouch = now - lastTouchRef.current;
      
      if (timeSinceLastTouch < touchDelay && timeSinceLastTouch > 0) {
        e.preventDefault();
        triggerHapticFeedback('medium');
        callback();
      }
      
      lastTouchRef.current = now;
    };
  }, [touchDelay, triggerHapticFeedback]);

  // Manejar long press
  const handleLongPress = useCallback((callback: () => void, duration: number = 500) => {
    let timeoutId: NodeJS.Timeout;
    
    return {
      onTouchStart: () => {
        timeoutId = setTimeout(() => {
          triggerHapticFeedback('heavy');
          callback();
        }, duration);
      },
      onTouchEnd: () => {
        clearTimeout(timeoutId);
      },
      onTouchMove: () => {
        clearTimeout(timeoutId);
      }
    };
  }, [triggerHapticFeedback]);

  // Optimizar el rendimiento de touch events
  const optimizedTouchHandler = useCallback((handler: (e: TouchEvent) => void) => {
    let rafId: number;
    
    return (e: TouchEvent) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        handler(e);
      });
    };
  }, []);

  // Configurar event listeners globales
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleTouchStart = optimizedTouchHandler((e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: e.timeStamp
      };
    });

    const handleTouchMove = optimizedTouchHandler(preventZoomHandler);
    const handleTouchEnd = optimizedTouchHandler(optimizeScrollHandler);

    // Configurar passive listeners para mejor rendimiento
    const options = { passive: false };
    
    document.addEventListener('touchstart', handleTouchStart, options);
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleTouchEnd, options);

    // Prevenir zoom con gestos de pellizco
    if (preventZoom) {
      document.addEventListener('gesturestart', (e) => e.preventDefault());
      document.addEventListener('gesturechange', (e) => e.preventDefault());
      document.addEventListener('gestureend', (e) => e.preventDefault());
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      if (preventZoom) {
        document.removeEventListener('gesturestart', (e) => e.preventDefault());
        document.removeEventListener('gesturechange', (e) => e.preventDefault());
        document.removeEventListener('gestureend', (e) => e.preventDefault());
      }
    };
  }, [preventZoomHandler, optimizeScrollHandler, optimizedTouchHandler, preventZoom]);

  // Configurar viewport para móviles
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Configurar viewport meta tag para prevenir zoom
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }

    const originalContent = viewportMeta.content;
    
    if (preventZoom) {
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    } else {
      viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    }

    // Configurar CSS para touch
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      input, textarea, [contenteditable] {
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      button, [role="button"], .touchable {
        touch-action: manipulation;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
      }
      
      .scroll-container {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      viewportMeta.content = originalContent;
      document.head.removeChild(style);
    };
  }, [preventZoom]);

  return {
    triggerHapticFeedback,
    handleDoubleTap,
    handleLongPress,
    detectSwipeGesture,
    optimizedTouchHandler
  };
};

export default useTouchOptimization;