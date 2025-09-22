'use client';

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  MessageCircle,
  ChevronDown,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useTouchOptimization from '@/hooks/useTouchOptimization';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  submenu?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Inicio',
    href: '/',
    icon: <Home size={20} />
  },
  {
    label: 'Clientes',
    href: '/clientes',
    icon: <Users size={20} />
  },
  {
    label: 'Calendario',
    href: '/calendario',
    icon: <Calendar size={20} />
  },
  {
    label: 'Obligaciones',
    href: '/obligaciones',
    icon: <FileText size={20} />,
    badge: 3
  },
  {
    label: 'Tareas',
    href: '/tareas',
    icon: <FileText size={20} />
  },
  {
    label: 'Auditorías',
    href: '/auditorias',
    icon: <FileText size={20} />
  },
  {
    label: 'Asistente IA',
    href: '/asistente-ia',
    icon: <MessageCircle size={20} />
  },
  {
    label: 'Contacto',
    href: '/contacto',
    icon: <Phone size={20} />
  },
  {
    label: 'Configuración',
    href: '/configuracion',
    icon: <Settings size={20} />
  }
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  
  const { triggerHapticFeedback } = useTouchOptimization({
    enableHapticFeedback: true,
    preventZoom: true
  });

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
    setExpandedSubmenu(null);
  }, [pathname]);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    triggerHapticFeedback('light');
  };

  const toggleSubmenu = (label: string) => {
    setExpandedSubmenu(expandedSubmenu === label ? null : label);
    triggerHapticFeedback('light');
  };

  const handleNavClick = () => {
    triggerHapticFeedback('medium');
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón de menú hamburguesa */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg border border-gray-200 lg:hidden"
        aria-label="Abrir menú de navegación"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Menú lateral */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header del menú */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">TuContable</h2>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Lista de navegación */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationItems.map((item) => (
            <div key={item.href}>
              {item.submenu ? (
                // Item con submenú
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`
                      w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors
                      ${pathname.startsWith(item.href) ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        expandedSubmenu === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Submenú */}
                  {expandedSubmenu === item.label && item.submenu && (
                    <div className="bg-gray-50">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={handleNavClick}
                          className={`
                            flex items-center space-x-3 px-12 py-3 hover:bg-gray-100 transition-colors
                            ${pathname === subItem.href ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}
                          `}
                        >
                          {subItem.icon}
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Item simple
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={`
                    flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition-colors
                    ${pathname === item.href ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'}
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center ml-auto">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Footer del menú */}
        <div className="p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 text-center">
            TuContable v1.0
          </div>
        </div>
      </nav>

      {/* Navegación de escritorio (oculta en móvil) */}
      <nav className="hidden lg:flex lg:items-center lg:space-x-6">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
              ${pathname === item.href ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[16px] text-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}