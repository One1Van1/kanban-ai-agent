'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Home, Users, Plus, Workflow, LayoutGrid, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from './language-selector';
import { ModeToggle } from '@/src/components/mode-toggle';
import { useTranslation } from '@/src/lib/i18n';
import { useSidebar } from '@/src/lib/SidebarContext';

export function Sidebar() {
  const { t } = useTranslation();
  const { isOpen, toggle } = useSidebar();

  return (
    <div
      className={`fixed left-0 top-0 z-40 h-screen border-r bg-background transition-transform duration-300 ${
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">AI Kanban</span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            <Home className="h-4 w-4" />
            {t('navigation.home')}
          </Link>

          <Link
            href="/agents"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            <Users className="h-4 w-4" />
            {t('navigation.agents')}
          </Link>

          <Link
            href="/agents/create"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent ml-6"
          >
            <Plus className="h-3 w-3" />
            {t('navigation.createAgent')}
          </Link>

          <Link
            href="/agents/flow-builder"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent ml-6"
          >
            <Workflow className="h-3 w-3" />
            {t('navigation.flowBuilder')}
          </Link>

          <Link
            href="/kanban"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            <LayoutGrid className="h-4 w-4" />
            {t('navigation.kanban')}
          </Link>
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            {t('footer.systemStatus')}
          </div>
        </div>
      </div>
    </div>
  );
}
