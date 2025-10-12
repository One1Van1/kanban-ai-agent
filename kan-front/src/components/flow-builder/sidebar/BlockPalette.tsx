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

// Создание реального preview блока для drag & drop
const createBlockPreview = (blockType: string, blockCategory: string) => {
  // Получаем информацию о блоке
  const blockInfo = getBlockInfo(blockType, blockCategory);
  const mockConfig = getDefaultBlockConfig(blockType);

  // Создаем div элемент который выглядит точно как блок на канвасе
  const previewDiv = document.createElement('div');

  // Цвета по категориям (ТОЧНО как у блоков на канвасе)
  const categoryStyles = {
    trigger: 'background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;', // bg-green-50 border-green-200 text-green-800
    context: 'background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af;', // bg-blue-50 border-blue-200 text-blue-800
    logic: 'background: #fefce8; border: 1px solid #fef08a; color: #a16207;', // bg-yellow-50 border-yellow-200 text-yellow-800
    action: 'background: #faf5ff; border: 1px solid #e9d5ff; color: #7c2d12;', // bg-purple-50 border-purple-200 text-purple-800
    wait: 'background: #fff7ed; border: 1px solid #fed7aa; color: #c2410c;', // bg-orange-50 border-orange-200 text-orange-800
  };

  const handleColors = {
    trigger: '#10b981', // bg-green-500
    context: '#3b82f6', // bg-blue-500
    logic: '#eab308', // bg-yellow-500
    action: '#a855f7', // bg-purple-500
    wait: '#f97316', // bg-orange-500
  };

  previewDiv.style.cssText = `
    position: absolute;
    top: -2000px;
    left: -2000px;
    width: 288px;
    min-height: 140px;
    ${categoryStyles[blockCategory as keyof typeof categoryStyles]}
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 16px;
    font-family: system-ui, -apple-system, sans-serif;
    pointer-events: none;
    z-index: 10000;
    visibility: visible;
    opacity: 1;
  `;

  // Добавляем handle'ы
  const topHandle = document.createElement('div');
  const bottomHandle = document.createElement('div');

  const handleStyle = `
    position: absolute;
    width: 12px;
    height: 12px;
    background: ${handleColors[blockCategory as keyof typeof handleColors]};
    border: 2px solid white;
    border-radius: 50%;
    left: 50%;
    transform: translateX(-50%);
  `;

  if (blockCategory !== 'trigger') {
    topHandle.style.cssText = handleStyle + 'top: -6px;';
    previewDiv.appendChild(topHandle);
  }

  bottomHandle.style.cssText = handleStyle + 'bottom: -6px;';
  previewDiv.appendChild(bottomHandle);

  // Создаем HTML содержимое точно как у блоков на канвасе
  previewDiv.innerHTML =
    `
    <!-- CardHeader -->
    <div style="padding-bottom: 8px;">
      <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 14px;">
        <div style="width: 16px; height: 16px; background: currentColor; border-radius: 2px; opacity: 0.8; margin-top: 1px;"></div>
        <span style="flex: 1; min-width: 0; font-weight: 500;">
          ${blockInfo.categoryName}
        </span>
        <span style="background: #f4f4f5; color: #71717a; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; max-width: 120px; text-align: center; white-space: normal; line-height: 1.2;">
          ${blockInfo.name}
        </span>
      </div>
    </div>
    
    <!-- CardContent -->
    <div style="padding-top: 0;">
      <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px; color: inherit;">
        ${blockInfo.name}
      </div>
      <div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
        ${getConfigTextSimple(blockType, mockConfig).replace(/\n/g, '<br>')}
      </div>
    </div>
  ` + previewDiv.innerHTML; // Добавляем к существующим handle'ам

  document.body.appendChild(previewDiv);
  return previewDiv;
};

// Рендер конфигурации блока как в настоящих блоках
const renderBlockConfig = (blockType: string, config: any) => {
  switch (blockType) {
    case 'board_move':
    case 'board_create':
      return (
        <>
          {config?.boardType && (
            <div className="text-xs text-muted-foreground mb-1">
              Board: {config.boardType.toUpperCase()}
            </div>
          )}
          {config?.targetColumn && (
            <div className="text-xs text-muted-foreground mb-1">
              Column: {config.targetColumn}
            </div>
          )}
          {config?.event && (
            <div className="text-xs text-muted-foreground">
              Event: {config.event.replace('_', ' ')}
            </div>
          )}
        </>
      );

    case 'comment':
      return (
        config?.commentText && (
          <div className="text-xs text-muted-foreground truncate">
            "{config.commentText}"
          </div>
        )
      );

    case 'ai_request':
      return (
        <>
          {config?.aiModel && (
            <div className="text-xs text-muted-foreground mb-1">
              Model: {config.aiModel.toUpperCase()}
            </div>
          )}
          {config?.prompt && (
            <div className="text-xs text-muted-foreground truncate">
              Prompt: "{config.prompt}"
            </div>
          )}
        </>
      );

    case 'extract_files':
      return (
        <>
          {config?.variableName && (
            <div className="text-xs text-muted-foreground mb-1">
              Variable: {config.variableName}
            </div>
          )}
          {config?.source && (
            <div className="text-xs text-muted-foreground">
              Source: {config.source.replace('_', ' ')}
            </div>
          )}
        </>
      );

    case 'wait_response':
      return (
        <>
          {config?.waitFor && (
            <div className="text-xs text-muted-foreground mb-1">
              Wait for: {config.waitFor.replace('_', ' ')}
            </div>
          )}
          {config?.timeout && (
            <div className="text-xs text-muted-foreground">
              Timeout: {Math.round(config.timeout / 1000)}s
            </div>
          )}
        </>
      );

    default:
      return (
        <div className="text-xs text-muted-foreground">
          Configure {getBlockDisplayName(blockType).toLowerCase()} settings
        </div>
      );
  }
};

// Получение конфигурации по умолчанию для preview
const getDefaultBlockConfig = (blockType: string) => {
  switch (blockType) {
    case 'board_move':
      return {
        boardType: 'jira',
        event: 'card_moved',
        targetColumn: 'In Progress',
      };
    case 'board_create':
      return {
        boardType: 'jira',
        event: 'card_created',
      };
    case 'comment':
      return {
        commentText: 'Add your comment here',
      };
    case 'ai_request':
      return {
        aiModel: 'claude',
        prompt: 'Analyze the task',
      };
    case 'extract_files':
      return {
        variableName: 'files',
        source: 'card_attachments',
      };
    case 'wait_response':
      return {
        waitFor: 'ai_response',
        timeout: 300000,
      };
    default:
      return {};
  }
};

// Получение простого текста конфигурации для canvas
const getConfigTextSimple = (blockType: string, config: any) => {
  switch (blockType) {
    case 'board_move':
    case 'board_create':
      return `Board: ${config?.boardType?.toUpperCase() || 'JIRA'}\nEvent: ${config?.event?.replace('_', ' ') || 'card moved'}`;

    case 'comment':
      return `"${config?.commentText || 'Add your comment here'}"`;

    case 'ai_request':
      return `Model: ${config?.aiModel?.toUpperCase() || 'CLAUDE'}\nPrompt: "${config?.prompt || 'Analyze the task'}"`;

    case 'extract_files':
      return `Variable: ${config?.variableName || 'files'}\nSource: ${config?.source?.replace('_', ' ') || 'card attachments'}`;

    case 'wait_response':
      return `Wait for: ${config?.waitFor?.replace('_', ' ') || 'ai response'}\nTimeout: ${config?.timeout ? Math.round(config.timeout / 1000) : 300}s`;

    default:
      return `Configure ${getBlockDisplayName(blockType).toLowerCase()} settings`;
  }
};

// Получение цвета handle для HTML
const getHandleColor = (blockCategory: string) => {
  const colors = {
    trigger: '#10b981',
    context: '#3b82f6',
    logic: '#eab308',
    action: '#a855f7',
    wait: '#f97316',
  };
  return colors[blockCategory as keyof typeof colors] || '#6b7280';
};

// Получение текста конфигурации для HTML
const getConfigText = (blockType: string, config: any) => {
  switch (blockType) {
    case 'board_move':
    case 'board_create':
      return `Board: ${config?.boardType?.toUpperCase() || 'JIRA'}<br>
              ${config?.targetColumn ? `Column: ${config.targetColumn}<br>` : ''}
              Event: ${config?.event?.replace('_', ' ') || 'card moved'}`;

    case 'comment':
      return `"${config?.commentText || 'Add your comment here'}"`;

    case 'ai_request':
      return `Model: ${config?.aiModel?.toUpperCase() || 'CLAUDE'}<br>
              Prompt: "${config?.prompt || 'Analyze the task'}"`;

    case 'extract_files':
      return `Variable: ${config?.variableName || 'files'}<br>
              Source: ${config?.source?.replace('_', ' ') || 'card attachments'}`;

    case 'wait_response':
      return `Wait for: ${config?.waitFor?.replace('_', ' ') || 'ai response'}<br>
              Timeout: ${config?.timeout ? Math.round(config.timeout / 1000) : 300}s`;

    default:
      return `Configure ${getBlockDisplayName(blockType).toLowerCase()} settings`;
  }
};

// Получение SVG иконки (упрощенная версия)
const getIconSVG = (blockType: string) => {
  // Простые SVG иконки для основных типов
  const icons = {
    board_move:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>',
    board_create:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
    comment:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    ai_request:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v15A2.5 2.5 0 0 0 9.5 22h5a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 14.5 2h-5z"/></svg>',
    default:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 14h7v7l9-11h-7V3z"/></svg>',
  };

  const iconSVG = icons[blockType as keyof typeof icons] || icons.default;
  return encodeURIComponent(iconSVG);
};

// Получение информации о блоке для preview
const getBlockInfo = (blockType: string, blockCategory: string) => {
  const categoryColors = {
    trigger:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-200',
    context:
      'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-200',
    logic:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-200',
    action:
      'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-800 dark:text-purple-200',
    wait: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/20 dark:border-orange-800 dark:text-orange-200',
  };

  const handleColors = {
    trigger: 'bg-green-500',
    context: 'bg-blue-500',
    logic: 'bg-yellow-500',
    action: 'bg-purple-500',
    wait: 'bg-orange-500',
  };

  const categoryNames = {
    trigger: 'Trigger',
    context: 'Context',
    logic: 'Logic',
    action: 'Action',
    wait: 'Wait',
  };

  const blockIcons = {
    // Triggers
    board_move: GitBranch,
    board_create: Plus,
    webhook: Globe,
    schedule: Calendar,

    // Context
    extract_files: FileText,
    get_card_data: Database,
    set_variable: Variable,

    // Logic
    if_else: GitBranch,
    switch: Settings,
    loop: RotateCcw,
    try_catch: AlertTriangle,

    // Actions
    comment: MessageSquare,
    ai_request: Brain,
    move_card: Move,
    create_file: FileUp,
    send_notification: Send,
    update_field: Edit,
    api_call: ExternalLink,

    // Wait
    wait_response: Clock,
    wait_timeout: Timer,
    wait_condition: CheckCircle,
  };

  return {
    name: getBlockDisplayName(blockType),
    categoryName: categoryNames[blockCategory as keyof typeof categoryNames],
    colorClass: categoryColors[blockCategory as keyof typeof categoryColors],
    handleColor: handleColors[blockCategory as keyof typeof handleColors],
    icon: blockIcons[blockType as keyof typeof blockIcons] || Zap,
    description: `Configure ${getBlockDisplayName(blockType)} settings`,
  };
};

// Получение правильного названия блока для drag image
const getBlockDisplayName = (blockType: string) => {
  const blockNames = {
    // Triggers
    board_move: 'Board Move',
    board_create: 'Board Create',
    board_update: 'Board Update',
    webhook: 'Webhook',
    schedule: 'Schedule',

    // Context
    extract_files: 'Extract Files',
    get_card_data: 'Get Card Data',
    set_variable: 'Set Variable',

    // Logic
    if_else: 'If/Else',
    switch: 'Switch',
    loop: 'Loop',
    try_catch: 'Try/Catch',

    // Actions
    comment: 'Add Comment',
    ai_request: 'AI Request',
    create_file: 'Create File',
    move_card: 'Move Card',
    send_notification: 'Send Notification',
    update_field: 'Update Field',
    api_call: 'API Call',

    // Wait
    wait_response: 'Wait Response',
    wait_timeout: 'Wait Timeout',
    wait_condition: 'Wait Condition',
  };

  return (
    blockNames[blockType as keyof typeof blockNames] ||
    blockType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

// Обработчики drag & drop для блоков
const handleDragStart = (
  event: React.DragEvent,
  blockType: string,
  blockCategory: string,
) => {
  event.dataTransfer.setData(
    'application/reactflow',
    JSON.stringify({ blockType, blockCategory }),
  );
  event.dataTransfer.effectAllowed = 'copy';

  // Создаем реальный блок preview СИНХРОННО
  const previewElement = createBlockPreview(blockType, blockCategory);

  // Устанавливаем drag image сразу (синхронно)
  if (previewElement) {
    event.dataTransfer.setDragImage(previewElement, 144, 70);
  }

  // Очищаем preview после drag
  setTimeout(() => {
    if (document.body.contains(previewElement)) {
      document.body.removeChild(previewElement);
    }
  }, 1000);

  // Добавляем визуальный эффект при драге
  const target = event.currentTarget as HTMLElement;
  target.style.opacity = '0.5';
  target.style.transform = 'scale(0.95)';
  target.style.transition = 'all 0.2s ease';
};

const handleDragEnd = (event: React.DragEvent) => {
  const target = event.currentTarget as HTMLElement;
  target.style.opacity = '1';
  target.style.transform = 'scale(1)';
  target.style.transition = 'all 0.2s ease';
};

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
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, block.type, block.category)
                    }
                    onDragEnd={handleDragEnd}
                    className="w-full justify-start h-auto p-2.5 text-left bg-background/50 dark:bg-background/30 hover:bg-muted/50 dark:hover:bg-muted/40 whitespace-normal border border-border/40 dark:border-border/70 hover:border-border/80 dark:hover:border-border transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] active:bg-muted/70 dark:active:bg-muted/60 hover:shadow-sm active:shadow-none cursor-grab active:cursor-grabbing"
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
