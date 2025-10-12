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
  Plus,
  Globe,
  Calendar,
  Settings,
  Move,
  FileUp,
  Send,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../../../lib/i18n';

interface BlockPaletteProps {
  onAddBlock: (blockType: string, blockCategory: string) => void;
}

interface PaletteBlock {
  type: string;
  category: 'trigger' | 'context' | 'logic' | 'action' | 'wait';
  icon: React.ReactNode;
  color: string;
}

const PALETTE_BLOCKS: PaletteBlock[] = [
  // Triggers
  {
    type: 'board_move',
    category: 'trigger',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-green-600',
  },
  {
    type: 'board_create',
    category: 'trigger',
    icon: <Plus className="w-4 h-4" />,
    color: 'text-green-600',
  },
  {
    type: 'webhook',
    category: 'trigger',
    icon: <Globe className="w-4 h-4" />,
    color: 'text-green-600',
  },
  {
    type: 'schedule',
    category: 'trigger',
    icon: <Calendar className="w-4 h-4" />,
    color: 'text-green-600',
  },

  // Context
  {
    type: 'extract_files',
    category: 'context',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-blue-600',
  },
  {
    type: 'get_card_data',
    category: 'context',
    icon: <Database className="w-4 h-4" />,
    color: 'text-blue-600',
  },
  {
    type: 'set_variable',
    category: 'context',
    icon: <Variable className="w-4 h-4" />,
    color: 'text-blue-600',
  },

  // Logic
  {
    type: 'if_else',
    category: 'logic',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-yellow-600',
  },
  {
    type: 'switch',
    category: 'logic',
    icon: <Settings className="w-4 h-4" />,
    color: 'text-yellow-600',
  },
  {
    type: 'loop',
    category: 'logic',
    icon: <RotateCcw className="w-4 h-4" />,
    color: 'text-yellow-600',
  },
  {
    type: 'try_catch',
    category: 'logic',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-yellow-600',
  },

  // Actions
  {
    type: 'comment',
    category: 'action',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'ai_request',
    category: 'action',
    icon: <Brain className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'move_card',
    category: 'action',
    icon: <Move className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'create_file',
    category: 'action',
    icon: <FileUp className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'send_notification',
    category: 'action',
    icon: <Send className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'update_field',
    category: 'action',
    icon: <Edit className="w-4 h-4" />,
    color: 'text-purple-600',
  },
  {
    type: 'api_call',
    category: 'action',
    icon: <ExternalLink className="w-4 h-4" />,
    color: 'text-purple-600',
  },

  // Wait
  {
    type: 'wait_response',
    category: 'wait',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-orange-600',
  },
  {
    type: 'wait_timeout',
    category: 'wait',
    icon: <Timer className="w-4 h-4" />,
    color: 'text-orange-600',
  },
  {
    type: 'wait_condition',
    category: 'wait',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-orange-600',
  },
];

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const { t } = useTranslation();

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

  const categoryColors = {
    trigger:
      'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800',
    context:
      'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800',
    logic:
      'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800',
    action:
      'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800',
    wait: 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800',
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {t('flowBuilder.blockPalette.title')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('flowBuilder.blockPalette.subtitle')}
        </p>
      </div>

      <div className="flex-1">
        <div className="p-3 space-y-3">
          {Object.entries(groupedBlocks).map(([category, blocks]) => (
            <Card
              key={category}
              className={
                categoryColors[category as keyof typeof categoryColors]
              }
            >
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm font-medium">
                  {t(`flowBuilder.blockPalette.categories.${category}`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3 space-y-1.5">
                {blocks.map((block) => (
                  <Button
                    key={block.type}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-auto p-2.5 text-left hover:bg-muted/50 whitespace-normal"
                    onClick={() => onAddBlock(block.type, block.category)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className={`mt-0.5 flex-shrink-0 ${block.color}`}>
                        {block.icon}
                      </div>
                      <div className="flex-1 space-y-0.5 min-w-0">
                        <div className="font-medium text-sm text-foreground break-words leading-tight">
                          {t(
                            `flowBuilder.blockPalette.blocks.${block.type}.name`,
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground break-words leading-tight">
                          {t(
                            `flowBuilder.blockPalette.blocks.${block.type}.description`,
                          )}
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
