'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import useTouchOptimization from '@/hooks/useTouchOptimization';

interface MobileNavigationContextType {
  isOpen: boolean;
  expandedSubmenu: string | null;
  setIsOpen: (isOpen: boolean) => void;
  setExpandedSubmenu: (submenu: string | null) => void;
  toggleMenu: () => void;
  toggleSubmenu: (label: string) => void;
}

const MobileNavigationContext = createContext<MobileNavigationContextType | undefined>(undefined);

export function MobileNavigationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);
  const { triggerHapticFeedback } = useTouchOptimization();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    triggerHapticFeedback('light');
  };

  const toggleSubmenu = (label: string) => {
    setExpandedSubmenu(expandedSubmenu === label ? null : label);
    triggerHapticFeedback('light');
  };

  return (
    <MobileNavigationContext.Provider value={{
      isOpen,
      expandedSubmenu,
      setIsOpen,
      setExpandedSubmenu,
      toggleMenu,
      toggleSubmenu
    }}>
      {children}
    </MobileNavigationContext.Provider>
  );
}

export function useMobileNavigation() {
  const context = useContext(MobileNavigationContext);
  if (context === undefined) {
    throw new Error('useMobileNavigation must be used within a MobileNavigationProvider');
  }
  return context;
}