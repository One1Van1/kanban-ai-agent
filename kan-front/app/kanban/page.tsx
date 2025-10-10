'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Plus, ArrowRight } from 'lucide-react';

export default function KanbanPage() {
  // Mock data for now
  const boards = [
    {
      id: '1',
      name: 'Development Sprint',
      description: 'Current development tasks and features',
      tasksCount: 24,
      activeAgents: 3,
    },
    {
      id: '2',
      name: 'QA Testing',
      description: 'Quality assurance and testing workflow',
      tasksCount: 12,
      activeAgents: 2,
    },
    {
      id: '3',
      name: 'Product Backlog',
      description: 'Future features and improvements',
      tasksCount: 45,
      activeAgents: 1,
    },
  ];

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
                <Button variant="ghost">Agents</Button>
              </Link>
              <Link href="/kanban">
                <Button variant="default">Kanban</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kanban Boards</h1>
            <p className="mt-2 text-gray-600">
              Manage your project workflows with AI-powered automation
            </p>
          </div>
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Button>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <Card
              key={board.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{board.name}</CardTitle>
                  <Badge variant="outline">{board.activeAgents} Agents</Badge>
                </div>
                <p className="text-sm text-gray-600">{board.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Tasks:</span>
                    <span className="font-semibold">{board.tasksCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">AI Agents:</span>
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 text-blue-600 mr-1" />
                      <span className="font-semibold">
                        {board.activeAgents} Active
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => {
                      // Navigate to board details (to be implemented)
                      console.log(`Opening board ${board.id}`);
                    }}
                  >
                    Open Board
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Create Board</h3>
                  <p className="text-sm text-gray-600">
                    Set up your project structure with custom columns
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Configure Agents</h3>
                  <p className="text-sm text-gray-600">
                    Set up AI agents to automate your workflow
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Start Working</h3>
                  <p className="text-sm text-gray-600">
                    Let AI handle routine tasks while you focus on important
                    work
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
