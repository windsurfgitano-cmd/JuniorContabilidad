'use client';

import React, { useEffect } from 'react';
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
  Phone,
  CheckSquare,
  Shield,
  FolderOpen,
  Bot,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useTouchOptimization from '@/hooks/useTouchOptimization';
import { useMobileNavigation } from '@/contexts/MobileNavigationContext';

interface NavigationItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  badge?: number;
  submenu?: NavigationItem[];
  isCategory?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Inicio',
    href: '/',
    icon: <Home size={20} />
  },
  {
    label: 'Agenda',
    icon: <Calendar size={20} />,
    isCategory: true,
    submenu: [
      {
        label: 'Calendario',
        href: '/calendario',
        icon: <Calendar size={18} />
      },
      {
        label: 'Tareas',
        href: '/tareas',
        icon: <CheckSquare size={18} />
      },
      {
        label: 'Obligaciones',
        href: '/obligaciones',
        icon: <FileText size={18} />,
        badge: 3
      }
    ]
  },
  {
    label: 'Gestión',
    icon: <Briefcase size={20} />,
    isCategory: true,
    submenu: [
      {
        label: 'Clientes',
        href: '/clientes',
        icon: <Users size={18} />
      },
      {
        label: 'Auditorías',
        href: '/auditorias',
        icon: <Shield size={18} />
      }
    ]
  },
  {
    label: 'Herramientas',
    icon: <Bot size={20} />,
    isCategory: true,
    submenu: [
      {
        label: 'Asistente IA',
        href: '/asistente-ia',
        icon: <MessageCircle size={18} />
      },
      {
        label: 'Historial',
        href: '/historial-conversaciones',
        icon: <FolderOpen size={18} />
      }
    ]
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

interface MobileNavigationProps {
  buttonOnly?: boolean;
}

export default function MobileNavigation({ buttonOnly = false }: MobileNavigationProps) {
  const { isOpen, setIsOpen, expandedSubmenu, setExpandedSubmenu, toggleMenu, toggleSubmenu } = useMobileNavigation();
  const { triggerHapticFeedback } = useTouchOptimization({
    enableHapticFeedback: true,
    preventZoom: true
  });
  const pathname = usePathname();

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



  const handleNavClick = () => {
    triggerHapticFeedback('medium');
    setIsOpen(false);
  };

  // Si solo queremos el botón (para el header)
  if (buttonOnly) {
    return (
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Abrir menú de navegación"
      >
        {isOpen ? <X size={24} className="text-black" /> : <Menu size={24} className="text-black" />}
      </button>
    );
  }

  return (
    <>
      {/* Botón de menú hamburguesa */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        aria-label="Abrir menú de navegación"
      >
        {isOpen ? <X size={24} className="text-black" /> : <Menu size={24} className="text-black" />}
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
            <h2 className="text-xl font-black text-gray-900 tracking-tighter" style={{ fontStretch: 'condensed' }}>KONTADOR</h2>
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
        <div className="flex-1 overflow-y-auto py-2">
          {navigationItems.map((item, index) => (
            <div key={`nav-item-${index}-${item.label}`}>
              {item.submenu || item.isCategory ? (
                // Categoría con submenú
                <div className="mb-2">
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`
                      w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors
                      ${item.isCategory ? 'bg-gray-100 font-semibold text-gray-800' : 'text-gray-700'}
                      ${item.href && pathname.startsWith(item.href) ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className={item.isCategory ? "font-semibold text-sm uppercase tracking-wide" : "font-medium"}>{item.label}</span>
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
                    <div className="bg-gradient-to-r from-gray-50 to-white border-l-2 border-gray-200 ml-4">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={`submenu-${index}-${subIndex}-${subItem.href}`}
                          href={subItem.href || '#'}
                          onClick={handleNavClick}
                          className={`
                            flex items-center justify-between px-8 py-3 hover:bg-blue-50 transition-colors group
                            ${pathname === subItem.href ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600 font-medium' : 'text-gray-600'}
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            {subItem.icon}
                            <span className="group-hover:font-medium transition-all">{subItem.label}</span>
                          </div>
                          {subItem.badge && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Item simple
                <div className="mb-1">
                  <Link
                    href={item.href || '#'}
                    onClick={handleNavClick}
                    className={`
                      flex items-center space-x-3 px-6 py-4 hover:bg-blue-50 transition-colors group rounded-r-lg mx-2
                      ${pathname === item.href ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium shadow-sm' : 'text-gray-700'}
                    `}
                  >
                    {item.icon}
                    <span className="font-medium group-hover:font-semibold transition-all">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center ml-auto">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer del menú */}
        <div className="p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 text-center">
            KONTADOR v1.0
          </div>
        </div>
      </nav>

      {/* Navegación de escritorio (oculta en móvil) */}
      <nav className="hidden lg:flex lg:items-center lg:space-x-6">
        {navigationItems
          .filter(item => !item.isCategory && item.href) // Solo mostrar items con href en desktop
          .map((item, index) => (
            <Link
              key={`desktop-nav-${index}-${item.href}`}
              href={item.href || '#'}
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