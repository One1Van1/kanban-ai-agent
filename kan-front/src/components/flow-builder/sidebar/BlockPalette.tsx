'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Zap,
  GitBranch,
  Database,
  FileText,
  Archive,
  Variable,
  MessageSquare,
  Brain,
  Paperclip,
  Bell,
  Clock,
  Timer,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

interface BlockPaletteProps {
  onAddBlock: (blockType: string, blockCategory: string) => void;
}

interface PaletteBlock {
  type: string;
  category: 'trigger' | 'context' | 'logic' | 'action' | 'wait';
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const PALETTE_BLOCKS: PaletteBlock[] = [
  // Triggers
  {
    type: 'board_move',
    category: 'trigger',
    name: 'Card Moved',
    description:
      'Triggered when a card is moved between columns (any board system)',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-green-600',
  },
  {
    type: 'board_create',
    category: 'trigger',
    name: 'Card Created',
    description: 'Triggered when a new card is created (any board system)',
    icon: <Database className="w-4 h-4" />,
    color: 'text-green-600',
  },
  {
    type: 'webhook',
    category: 'trigger',
    name: 'Webhook',
    description: 'Triggered by external webhook from any system',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-green-600',
  },
  {
    type: 'time_based',
    category: 'trigger',
    name: 'Schedule',
    description: 'Triggered at specific times or intervals',
    icon: <Timer className="w-4 h-4" />,
    color: 'text-green-600',
  },

  // Context
  {
    type: 'extract_files',
    category: 'context',
    name: 'Extract Files',
    description: 'Extract files from card attachments',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-blue-600',
  },
  {
    type: 'get_card_data',
    category: 'context',
    name: 'Get Card Data',
    description: 'Extract data from card fields',
    icon: <Archive className="w-4 h-4" />,
    color: 'text-blue-600',
  },
  {
    type: 'variable',
    category: 'context',
    name: 'Set Variable',
    description: 'Create or update a variable',
    icon: <Variable className="w-4 h-4" />,
    color: 'text-blue-600',
  },

  // Logic
  {
    type: 'if_else',
    category: 'logic',
    name: 'If/Else',
    description: 'Conditional branching based on variable values',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-yellow-600',
  },
  {
    type: 'switch',
    category: 'logic',
    name: 'Switch',
    description: 'Multiple condition branching',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-yellow-600',
  },
  {
    type: 'loop',
    category: 'logic',
    name: 'Loop',
    description: 'Repeat actions for each item',
    icon: <RotateCcw className="w-4 h-4" />,
    color: 'text-yellow-600',
  },
  {
    type: 'try_catch',
    category: 'logic',
    name: 'Try/Catch',
    description: 'Error handling block',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-yellow-600',
  },

  // Actions
  {
    type: 'comment',
    category: 'action',
    name: 'Add Comment',
    description: 'Add a comment to the card',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'ai_request',
    category: 'action',
    name: 'AI Request',
    description: 'Send request to AI model with files',
    icon: <Brain className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'create_file',
    category: 'action',
    name: 'Create File',
    description: 'Create a new file with content',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'attach_file',
    category: 'action',
    name: 'Attach File',
    description: 'Attach file to the card',
    icon: <Paperclip className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'send_notification',
    category: 'action',
    name: 'Send Notification',
    description: 'Send email or Telegram notification',
    icon: <Bell className="w-4 h-4" />,
    color: 'text-purple-600',
  },

  // Wait
  {
    type: 'wait_response',
    category: 'wait',
    name: 'Wait for Response',
    description: 'Wait for AI response or external action',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-orange-600',
  },
  {
    type: 'wait_time',
    category: 'wait',
    name: 'Wait Time',
    description: 'Wait for specific amount of time',
    icon: <Timer className="w-4 h-4" />,
    color: 'text-orange-600',
  },
  {
    type: 'wait_condition',
    category: 'wait',
    name: 'Wait Condition',
    description: 'Wait until condition is met',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-orange-600',
  },
];

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const groupedBlocks = PALETTE_BLOCKS.reduce(
    (acc, block) => {
      if (!acc[block.category]) {
        acc[block.category] = [];
      }
      acc[block.category].push(block);
      return acc;
    },
    {} as Record<string, PaletteBlock[]>,
  );

  const categoryTitles = {
    trigger: 'Triggers',
    context: 'Context',
    logic: 'Logic',
    action: 'Actions',
    wait: 'Wait',
  };

  const categoryColors = {
    trigger: 'bg-green-50 border-green-200',
    context: 'bg-blue-50 border-blue-200',
    logic: 'bg-yellow-50 border-yellow-200',
    action: 'bg-purple-50 border-purple-200',
    wait: 'bg-orange-50 border-orange-200',
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Block Palette</h2>
        <p className="text-sm text-gray-500 mt-1">
          Drag blocks to canvas to build your flow
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {Object.entries(groupedBlocks).map(([category, blocks]) => (
            <Card
              key={category}
              className={
                categoryColors[category as keyof typeof categoryColors]
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {categoryTitles[category as keyof typeof categoryTitles]}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {blocks.map((block) => (
                  <Button
                    key={block.type}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => onAddBlock(block.type, block.category)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className={`mt-0.5 ${block.color}`}>
                        {block.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-gray-900">
                          {block.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {block.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
