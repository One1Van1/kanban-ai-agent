'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sidebar } from './sidebar';
import { useSidebar } from '@/src/lib/SidebarContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();
  const isFlowBuilder = pathname === '/agents/flow-builder';

  // Flow Builder теперь управляет своим собственным сайдбаром
  if (isFlowBuilder) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      {/* Кнопка для открытия сайдбара когда он закрыт */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="fixed top-4 left-4 z-50 h-10 w-10 p-0 shadow-md border bg-background"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Обычные страницы с padding */}
        <div
          className={`p-6 transition-all duration-300 ${!isOpen ? 'pt-20' : 'pt-16 md:pt-6'}`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
