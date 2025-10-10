'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Workflow, ArrowLeft, Play, Settings, FileText } from 'lucide-react';

export default function FlowBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/agents"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Agents
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Workflow className="w-8 h-8 text-purple-600" />
                Visual Flow Builder
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Create intelligent AI workflows with drag & drop interface
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="h-10">
                <FileText className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button className="h-10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                Universal Triggers
              </CardTitle>
              <CardDescription>
                Works with ANY board system: Jira, Trello, Asana, Notion,
                Monday.com, ClickUp, or generic webhooks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                Smart Logic & AI
              </CardTitle>
              <CardDescription>
                Conditional logic, AI requests to any model, file operations,
                and multi-channel notifications
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                Test & Deploy
              </CardTitle>
              <CardDescription>
                Test with any board system, validate workflows, and deploy to
                production
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Example Flow */}
        {/* Example Flow */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              Example: Universal Photo Analysis Flow
            </CardTitle>
            <CardDescription>
              Works with ANY board system - not just Jira! Your team lead
              mentioned Jira as an example for testing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  📋 Board Move Trigger
                </div>
                <span>→</span>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  📁 Extract Files
                </div>
                <span>→</span>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  🔀 IF/ELSE
                </div>
                <span>→</span>
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  🤖 AI Analysis
                </div>
                <span>→</span>
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  ⏱️ Wait Response
                </div>
                <span>→</span>
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  📄 Create Report
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-3">
                <strong>Universal Flow Logic:</strong> When card moves to "В
                работе" on ANY board → Extract user photos → If photos exist →
                Send to AI for analysis → Create DOCX report, else → Add comment
                asking for photos
              </div>

              <div className="text-xs bg-blue-50 text-blue-700 p-3 rounded">
                <strong>💡 Works with:</strong> Jira, Trello, Asana, Notion,
                Monday.com, ClickUp, Linear, GitHub Projects, or any custom
                board via webhooks!
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <Workflow className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Flow Builder Coming Soon! 🚀
              </h2>
              <p className="text-gray-600 mb-6">
                We're building the visual flow builder based on your team lead's
                requirements. It will include drag & drop interface for creating
                complex AI workflows.
              </p>

              <div className="space-y-2 text-left text-sm text-gray-700 bg-white/50 rounded-lg p-4">
                <div className="font-semibold mb-2">
                  Features in development:
                </div>
                <div>✅ Trigger blocks (Jira integration)</div>
                <div>✅ Context extraction (files, variables)</div>
                <div>✅ Conditional logic (IF/ELSE, loops)</div>
                <div>✅ Action blocks (AI requests, comments, files)</div>
                <div>✅ Wait blocks (async operations)</div>
                <div>⏳ Visual canvas with React Flow</div>
                <div>⏳ Properties panel</div>
                <div>⏳ Block palette</div>
                <div>⏳ Flow testing & deployment</div>
              </div>

              <Button className="mt-6" disabled>
                <Play className="w-4 h-4 mr-2" />
                Launch Builder (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation Status */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Technical Note:</strong> All Flow Builder components are
            created and ready. Currently resolving React Flow TypeScript
            integration for the visual canvas.
          </p>
        </div>
      </div>
    </div>
  );
}
