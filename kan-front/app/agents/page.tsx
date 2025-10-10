'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAgentsStore } from '@/src/lib/stores/agents-store';
import {
  Bot,
  Plus,
  Activity,
  Settings,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';

export default function AgentsPage() {
  const { agents, isLoading, error, fetchAgents } = useAgentsStore();

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading agents...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">Error: {error}</p>
              <Button onClick={fetchAgents} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center">
                  <Bot className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    AI Kanban Agent
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/agents">
                <Button variant="default">Agents</Button>
              </Link>
              <Link href="/kanban">
                <Button variant="ghost">Kanban</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
            <p className="mt-2 text-gray-600">
              Manage your intelligent automation agents
            </p>
          </div>
          <Link href="/agents/create">
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Agents
              </CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <PlayCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {agents.filter((agent) => agent.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <PauseCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {agents.filter((agent) => !agent.isActive).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        {agents.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Agents Found</CardTitle>
              <CardDescription>
                Get started by creating your first AI agent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/agents/create">
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Agent
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge variant={agent.isActive ? 'default' : 'secondary'}>
                      {agent.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Settings className="h-4 w-4 mr-2" />
                      Role: {agent.role}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="h-4 w-4 mr-2" />
                      Specialization: {agent.specialization}
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Link href={`/agents/${agent.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/agents/${agent.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
