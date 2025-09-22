'use client';

import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // Velocidad en ms por carácter
  onComplete?: () => void;
  onProgress?: (currentText: string) => void;
  className?: string;
  isStreaming?: boolean;
}

export default function TypewriterText({ 
  text, 
  speed = 30, 
  onComplete, 
  onProgress,
  className = '',
  isStreaming = false
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTextRef = useRef('');

  // Early return si no hay contenido
  if (!text) {
    return (
      <div className="prose prose-sm max-w-none">
        <div className="flex items-center space-x-2">
          <div className="animate-pulse">Escribiendo...</div>
        </div>
      </div>
    );
  }

  // Efecto para manejar el texto que llega por streaming
  useEffect(() => {
    if (isStreaming) {
      // En modo streaming, mostrar el texto inmediatamente
      setDisplayedText(text);
      onProgress?.(text);
      return;
    }

    // Solo reiniciar si el texto cambió completamente
    if (text !== lastTextRef.current) {
      lastTextRef.current = text;
      setDisplayedText('');
      setCurrentIndex(0);
      setIsComplete(false);
    }
  }, [text, isStreaming, onProgress]);

  // Efecto para el efecto de escritura
  useEffect(() => {
    // Validar que text existe y no es undefined
    if (!text || isStreaming || isComplete || currentIndex >= text.length) {
      if (text && currentIndex >= text.length && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
      return;
    }

    intervalRef.current = setTimeout(() => {
      const nextIndex = currentIndex + 1;
      const newText = text.slice(0, nextIndex);
      
      setDisplayedText(newText);
      setCurrentIndex(nextIndex);
      onProgress?.(newText);
      
      // Velocidad variable: más rápido para espacios y puntuación
      const currentChar = text[currentIndex];
      const nextSpeed = currentChar === ' ' ? speed * 0.3 : 
                       currentChar === '.' || currentChar === ',' || currentChar === ';' ? speed * 2 :
                       speed;
      
      if (nextIndex < text.length) {
        intervalRef.current = setTimeout(() => {
          setCurrentIndex(nextIndex);
        }, nextSpeed);
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentIndex, text, speed, isComplete, isStreaming, onComplete, onProgress]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  // Formatear el texto con markdown básico
  const formatText = (content: string) => {
    if (!content) return '';
    
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={className}>
      <div
        dangerouslySetInnerHTML={{
          __html: formatText(displayedText)
        }}
        className="whitespace-pre-wrap leading-relaxed"
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      />
      {!isComplete && !isStreaming && (
        <span className="inline-block w-2 h-5 bg-emerald-600 ml-1 animate-pulse" />
      )}
    </div>
  );
}