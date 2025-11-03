'use client';

import { useState } from 'react';
import { useFlows } from './hooks/useFlows';
import { FlowsHeader } from './components/FlowsHeader';
import { FlowsFilters } from './components/FlowsFilters';
import { EditableFlowCard } from './components/EditableFlowCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Workflow, Activity, Zap } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';
import type { FlowItem } from './hooks/useFlows';

export function FlowsPageContent() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { flows, loading, error, reload } = useFlows(searchTerm, statusFilter);

  // Функции для работы с потоками
  const handleExecute = (flowId: string, flowName: string) => {
    console.log('Execute flow:', flowId, flowName);
    // TODO: Implement flow execution
  };

  const handleClone = (flowId: string, flowName: string) => {
    console.log('Clone flow:', flowId, flowName);
    // TODO: Implement flow cloning
  };

  const handleDelete = (flowId: string, flowName: string) => {
    console.log('Delete flow:', flowId, flowName);
    // TODO: Implement flow deletion
  };

  const handleDeploy = (flowId: string, flowName: string) => {
    console.log('Deploy flow:', flowId, flowName);
    // TODO: Implement flow deployment
  };

  const handleUpdateMetadata = async (
    flowId: string,
    name: string,
    description?: string,
  ) => {
    console.log('Update metadata:', flowId, name, description);
    // TODO: Implement metadata update API call
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto">
        <FlowsHeader />

        {/* Status Card */}
        <div className="mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-center text-center">
                <div className="flex items-center gap-3">
                  <Workflow className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {loading
                        ? 'Loading flows...'
                        : error
                          ? 'Error loading flows'
                          : `${flows.length} flows found`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {loading
                        ? 'Please wait...'
                        : error
                          ? error
                          : 'Manage your automation flows'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <FlowsFilters
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        {/* Editable Flow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow: FlowItem) => (
            <EditableFlowCard
              key={flow.flowId}
              flow={flow}
              onExecute={handleExecute}
              onClone={handleClone}
              onDelete={handleDelete}
              onDeploy={handleDeploy}
              onUpdateMetadata={handleUpdateMetadata}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              t={t}
            />
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <Workflow className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Visual Workflow Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create complex automation flows with an intuitive drag-and-drop
                interface
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Activity className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Real-time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track flow executions and monitor performance in real-time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>Instant Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Deploy flows to agents with a single click
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
