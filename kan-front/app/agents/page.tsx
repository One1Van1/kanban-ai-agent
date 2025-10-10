'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Plus, Activity, Settings } from 'lucide-react';

export default function AgentsPage() {
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
              Manage your AI agents for automated Kanban workflows
            </p>
          </div>
          <Link href="/agents/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </Link>
        </div>

        {/* Status Message */}
        <div className="mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Bot className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Agents are being created successfully!
                  </p>
                  <p className="text-sm text-green-700">
                    Check your database to see created agents. API endpoints for
                    listing agents will be added soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Agents System Ready
              </h3>
              <p className="text-gray-600 mb-6">
                Create AI agents to automate your Kanban workflow. Agents can
                comment on tasks, move them between columns, and much more!
              </p>
              <Link href="/agents/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Agent
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <Bot className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Task Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create agents that automatically comment on tasks, move them
                between columns, and notify team members.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Activity className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Smart Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Agents can monitor task progress, detect bottlenecks, and
                suggest improvements to your workflow.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Easy Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Set up agents with simple instructions and let them handle
                repetitive tasks automatically.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
