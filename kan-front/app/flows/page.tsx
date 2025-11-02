'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Input } from '@/src/shared/components/ui/input';
import { EditableFlowCard } from '@/src/features/flows/components/EditableFlowCard';
import {
  Workflow,
  Activity,
  Settings,
  Edit,
  Play,
  Copy,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Clock,
  Bot,
  User,
  FileText,
  Zap,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/components/ui/dropdown-menu';
import { useTranslation } from '@/src/shared/i18n';
import { flowsAPI } from '@/src/features/flows/api/flows.api';
import { useFlowBuilderStore } from '@/src/features/flow-builder/stores/flow-builder.store';
import { useDialog } from '@/src/shared/hooks/use-dialog';

interface FlowItem {
  flowId: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  agentId?: string;
  blockCount: number;
  metadata?: any;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export default function FlowsPage() {
  const { t } = useTranslation();
  const { executeFlow } = useFlowBuilderStore();
  const { showAlert, showConfirm } = useDialog();

  const [flows, setFlows] = useState<FlowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadFlows();
    }
  }, [searchTerm, statusFilter]);

  const loadFlows = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading flows...');

      const response = await flowsAPI.list({
        limit: 50,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      console.log('✅ Flows loaded successfully:', response);
      setFlows(response.items || []);
    } catch (err) {
      console.error('❌ Failed to load flows:', err);
      setError(err instanceof Error ? err.message : 'Failed to load flows');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteFlow = async (flowId: string, flowName: string) => {
    try {
      console.log('🚀 Executing flow:', flowName);
      await executeFlow(flowId, { trigger: 'manual' });
      showAlert(
        `Flow "${flowName}" ${t('flows.execution.started')}`,
        'success',
      );
    } catch (err) {
      console.error('❌ Failed to execute flow:', err);
      showAlert(
        `${t('flows.execution.failed')} ${err instanceof Error ? err.message : 'Unknown error'}`,
        'error',
      );
    }
  };

  const handleCloneFlow = async (flowId: string, flowName: string) => {
    try {
      console.log('📋 Cloning flow:', flowName);
      await flowsAPI.clone(flowId, {
        name: `${flowName} (Copy)`,
        description: `Cloned version of ${flowName}`,
        clonedBy: 'current-user', // TODO: Get from auth
      });
      showAlert(`Flow "${flowName}" ${t('flows.clone.success')}`, 'success');
      loadFlows(); // Refresh list
    } catch (err) {
      console.error('❌ Failed to clone flow:', err);
      showAlert(
        `${t('flows.clone.failed')} ${err instanceof Error ? err.message : 'Unknown error'}`,
        'error',
      );
    }
  };

  const handleDeleteFlow = async (flowId: string, flowName: string) => {
    const confirmed = await showConfirm(
      `${t('flows.delete.confirm')}`,
      'Удалить Flow?',
    );
    if (confirmed) {
      try {
        console.log('🗑️ Deleting flow:', flowName);
        await flowsAPI.delete(flowId);
        showAlert(`Flow "${flowName}" ${t('flows.delete.success')}`, 'success');
        loadFlows(); // Refresh list
      } catch (err) {
        console.error('❌ Failed to delete flow:', err);
        showAlert(
          `${t('flows.delete.failed')} ${err instanceof Error ? err.message : 'Unknown error'}`,
          'error',
        );
      }
    }
  };

  const handleDeployToAgent = async (flowId: string, flowName: string) => {
    try {
      console.log('🤖 Deploying flow to agent:', flowName);
      const result = await flowsAPI.deployToAgent(flowId, {
        userId: 'current-user', // TODO: Get from auth
        agentName: `${flowName} Agent`,
        agentDescription: `Agent created from flow: ${flowName}`,
      });

      showAlert(
        `${t('flows.deploy.success')}: ${result.createdAgent.name}`,
        'success',
      );
      loadFlows(); // Refresh list to show agentId
    } catch (err) {
      console.error('❌ Failed to deploy flow to agent:', err);
      showAlert(
        `${t('flows.deploy.failed')} ${err instanceof Error ? err.message : 'Unknown error'}`,
        'error',
      );
    }
  };

  const handleUpdateMetadata = async (
    flowId: string,
    name: string,
    description?: string,
  ) => {
    try {
      console.log('📝 Updating flow metadata:', { flowId, name, description });
      await flowsAPI.update(flowId, {
        name,
        description,
        updatedBy: 'current-user', // TODO: Get from auth
      });

      // Обновляем локальный стейт
      setFlows((prevFlows) =>
        prevFlows.map((f) =>
          f.flowId === flowId
            ? { ...f, name, description, updatedAt: new Date().toISOString() }
            : f,
        ),
      );

      // Уведомление показывается в EditableFlowCard
    } catch (err) {
      console.error('❌ Failed to update flow metadata:', err);
      // Уведомление об ошибке показывается в EditableFlowCard
      throw err; // Пробрасываем ошибку чтобы компонент мог обработать
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Zap className="h-3 w-3" />;
      case 'draft':
        return <FileText className="h-3 w-3" />;
      case 'archived':
        return <Clock className="h-3 w-3" />;
      default:
        return <Settings className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('flows.title')}</h1>
          <p className="text-muted-foreground">{t('flows.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('flows.title')}</h1>
          <p className="text-muted-foreground">{t('flows.subtitle')}</p>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <Settings className="h-5 w-5" />
              <span className="font-medium">{t('flows.errorTitle')}</span>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={loadFlows}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-100"
            >
              {t('common.tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('flows.title')}</h1>
            <p className="text-muted-foreground">{t('flows.subtitle')}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Workflow className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('flows.stats.totalFlows')}
                  </p>
                  <p className="text-2xl font-bold">{flows.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('flows.stats.activeFlows')}
                  </p>
                  <p className="text-2xl font-bold">
                    {flows.filter((f) => f.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('flows.stats.drafts')}
                  </p>
                  <p className="text-2xl font-bold">
                    {flows.filter((f) => f.status === 'draft').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('flows.stats.avgBlocks')}
                  </p>
                  <p className="text-2xl font-bold">
                    {flows.length > 0
                      ? Math.round(
                          flows.reduce((acc, f) => acc + f.blockCount, 0) /
                            flows.length,
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('flows.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t('flows.search.status')}
              {statusFilter && (
                <Badge variant="secondary" className="ml-2">
                  {statusFilter}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('')}>
              {t('flows.search.all')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>
              <Zap className="h-4 w-4 mr-2" />
              {t('flows.status.active')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
              <FileText className="h-4 w-4 mr-2" />
              {t('flows.status.draft')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('archived')}>
              <Clock className="h-4 w-4 mr-2" />
              {t('flows.status.archived')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Flows Grid */}
      {flows.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <Workflow className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">{t('flows.noFlows')}</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter
              ? 'Try adjusting your search or filters'
              : t('flows.noFlowsDescription')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <EditableFlowCard
              key={flow.flowId}
              flow={flow}
              onExecute={handleExecuteFlow}
              onClone={handleCloneFlow}
              onDelete={handleDeleteFlow}
              onDeploy={handleDeployToAgent}
              onUpdateMetadata={handleUpdateMetadata}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}
