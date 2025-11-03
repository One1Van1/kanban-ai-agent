import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Sidebar as AppSidebar } from '@/src/shared/components/ui/sidebar';
import { ArrowLeft, Edit, Menu, FileText, Clock, Bot } from 'lucide-react';
import { useSidebar } from '@/src/lib/SidebarContext';
import { FlowItem } from '../hooks/useFlowsList';

interface FlowsListProps {
  flows: FlowItem[];
  isLoading: boolean;
  onSelectFlow: (flowId: string) => void;
}

export function FlowsList({ flows, isLoading, onSelectFlow }: FlowsListProps) {
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <AppSidebar />

      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 h-10 w-10 p-0 shadow-md border bg-background"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <div
        className={`flex-1 h-full transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 bg-card border-b border-border shadow-sm flex-shrink-0">
            <div className="h-full flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/flows"
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                </Link>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Edit className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">
                      Выберите Flow для редактирования
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Выберите существующий flow из списка ниже
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 bg-background overflow-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Загрузка flows...</p>
              </div>
            ) : flows.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Нет доступных flows
                </h3>
                <p className="text-muted-foreground mb-4">
                  Создайте новый flow в Flow Builder, чтобы его можно было
                  редактировать
                </p>
                <Link href="/agents/flow-builder">
                  <Button>Создать новый Flow</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flows.map((flow) => (
                  <Card
                    key={flow.flowId}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                    onClick={() => onSelectFlow(flow.flowId)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg line-clamp-1">
                            {flow.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                flow.status === 'active'
                                  ? 'default'
                                  : flow.status === 'draft'
                                    ? 'secondary'
                                    : 'outline'
                              }
                            >
                              {flow.status}
                            </Badge>
                            {flow.agentId && (
                              <Badge variant="outline" className="text-xs">
                                <Bot className="h-3 w-3 mr-1" />
                                Deployed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {flow.description || 'Нет описания'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {flow.blockCount || 0} блоков
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(flow.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
