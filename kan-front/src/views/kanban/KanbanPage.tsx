'use client';

import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Bot, Plus, ArrowRight, Users, Calendar } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';

export default function KanbanPage() {
  const { t } = useTranslation();

  // Mock data for now
  const boards = [
    {
      id: '1',
      name: t('kanban.boards.development.name'),
      description: t('kanban.boards.development.description'),
      tasksCount: 24,
      activeAgents: 3,
    },
    {
      id: '2',
      name: t('kanban.boards.qa.name'),
      description: t('kanban.boards.qa.description'),
      tasksCount: 12,
      activeAgents: 2,
    },
    {
      id: '3',
      name: t('kanban.boards.backlog.name'),
      description: t('kanban.boards.backlog.description'),
      tasksCount: 45,
      activeAgents: 1,
    },
  ];

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('kanban.title')}
            </h1>
            <p className="mt-2 text-muted-foreground">{t('kanban.subtitle')}</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            {t('kanban.createBoard')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Card
              key={board.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{board.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {board.description}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {board.activeAgents} {t('kanban.agents')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {board.tasksCount} {t('kanban.tasks')}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {board.activeAgents} {t('kanban.agents')}
                  </div>
                </div>
                <Link href={`/kanban/${board.id}`}>
                  <Button variant="outline" className="w-full">
                    {t('kanban.openBoard')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card>
            <CardContent className="text-center py-12">
              <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('kanban.noBoards.title')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('kanban.noBoards.description')}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('kanban.createBoard')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
