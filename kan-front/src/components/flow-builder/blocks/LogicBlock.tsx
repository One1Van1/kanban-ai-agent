'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GitBranch,
  RotateCcw,
  AlertTriangle,
  Brain,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n/LanguageContext';

interface LogicBlockProps {
  data: { type: string; name: string; config: any };
  id: string;
  selected: boolean;
  onDeleteBlock?: (nodeId: string) => void;
}

export function LogicBlock({
  data,
  id,
  selected,
  onDeleteBlock,
}: LogicBlockProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const renderIcon = () => {
    switch (data.type) {
      case 'if_else':
        return <GitBranch className="w-4 h-4" />;
      case 'switch':
        return <GitBranch className="w-4 h-4" />;
      case 'loop':
        return <RotateCcw className="w-4 h-4" />;
      case 'try_catch':
        return <AlertTriangle className="w-4 h-4" />;
      case 'ai_result':
        return <Brain className="w-4 h-4" />;
      default:
        return <GitBranch className="w-4 h-4" />;
    }
  };

  const colorClass =
    'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-200';

  return (
    <Card
      className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${colorClass} transition-all hover:shadow-md`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-sm">
          {renderIcon()}
          <span className="flex-1 min-w-0">
            {t('flowBuilder.blockPalette.categories.logic')}
          </span>
          <div className="flex items-center gap-1">
            <Badge
              variant="secondary"
              className="text-xs px-2 py-1 max-w-[100px] text-center leading-tight whitespace-normal"
            >
              {t(`flowBuilder.blockPalette.blocks.${data.type}.name`)}
            </Badge>
            {/* Кнопка редактирования только для блоков, которые можно настраивать */}
            {data.type !== 'switch' && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 border border-border/40 hover:border-border hover:bg-background/50"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(!isEditing);
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
            {onDeleteBlock && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBlock?.(id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isEditing ? (
          <div className="space-y-2">
            <div className="text-xs font-medium mb-2">
              {t('flowBuilder.editMode')}
            </div>
            <div className="space-y-1">
              {/* Поля для if_else */}
              {data.type === 'if_else' && (
                <>
                  <input
                    type="text"
                    placeholder={t('flowBuilder.fields.variable')}
                    defaultValue={data.config?.condition?.variable || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <select
                    defaultValue={data.config?.condition?.operator || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">
                      {t('flowBuilder.fields.condition')}
                    </option>
                    <option value="equals">Equals (==)</option>
                    <option value="not_equals">Not Equals (!=)</option>
                    <option value="greater">Greater (&gt;)</option>
                    <option value="less">Less (&lt;)</option>
                    <option value="contains">Contains</option>
                  </select>
                  <input
                    type="text"
                    placeholder={t('flowBuilder.fields.value')}
                    defaultValue={data.config?.condition?.value || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                </>
              )}

              {/* Поля для loop */}
              {data.type === 'loop' && (
                <>
                  <input
                    type="text"
                    placeholder="Collection/Array"
                    defaultValue={data.config?.collection || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="text"
                    placeholder="Item Variable"
                    defaultValue={data.config?.itemVariable || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="number"
                    placeholder="Max Iterations"
                    defaultValue={data.config?.maxIterations || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                </>
              )}

              {/* Поля для try_catch */}
              {data.type === 'try_catch' && (
                <>
                  <input
                    type="text"
                    placeholder="Error Variable"
                    defaultValue={data.config?.errorVariable || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <select
                    defaultValue={data.config?.errorType || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Error Type</option>
                    <option value="all">All Errors</option>
                    <option value="api">API Errors</option>
                    <option value="validation">Validation Errors</option>
                    <option value="timeout">Timeout Errors</option>
                  </select>
                </>
              )}

              {/* Поля для ai_result */}
              {data.type === 'ai_result' && (
                <>
                  <input
                    type="text"
                    placeholder={t('flowBuilder.fields.variable')}
                    defaultValue={data.config?.responseVariable || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="text"
                    placeholder="AI Model"
                    defaultValue={data.config?.aiModel || ''}
                    className="w-full text-xs px-2 py-1 border rounded bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                </>
              )}
            </div>
            <div className="flex gap-1 pt-1">
              <Button
                size="sm"
                className="text-xs h-6 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                  // TODO: Сохранить изменения
                }}
              >
                {t('flowBuilder.save')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
              >
                {t('flowBuilder.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-medium mb-2">
              {t(`flowBuilder.blockPalette.blocks.${data.type}.name`)}
            </div>

            {/* Отображение для if_else */}
            {data.type === 'if_else' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.variable')}:{' '}
                  {data.config?.condition?.variable ||
                    t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.condition')}:{' '}
                  {data.config?.condition?.operator ||
                    t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('flowBuilder.fields.value')}:{' '}
                  {data.config?.condition?.value ||
                    t('flowBuilder.fields.notSet')}
                </div>
              </>
            )}

            {/* Отображение для loop */}
            {data.type === 'loop' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.collection')}:{' '}
                  {data.config?.collection || t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.itemVariable')}:{' '}
                  {data.config?.itemVariable || t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('flowBuilder.fields.maxIterations')}:{' '}
                  {data.config?.maxIterations || t('flowBuilder.fields.notSet')}
                </div>
              </>
            )}

            {/* Отображение для try_catch */}
            {data.type === 'try_catch' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.errorVariable')}:{' '}
                  {data.config?.errorVariable || t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('flowBuilder.fields.errorType')}:{' '}
                  {data.config?.errorType || t('flowBuilder.fields.notSet')}
                </div>
              </>
            )}

            {/* Отображение для ai_result */}
            {data.type === 'ai_result' && (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('flowBuilder.fields.variable')}:{' '}
                  {data.config?.responseVariable ||
                    t('flowBuilder.fields.notSet')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('flowBuilder.fields.aiModel')}:{' '}
                  {data.config?.aiModel || t('flowBuilder.fields.notSet')}
                </div>
              </>
            )}

            {/* Отображение для switch - простой переключатель без настроек */}
            {data.type === 'switch' && (
              <div className="text-xs text-muted-foreground">
                {t('flowBuilder.blockPalette.blocks.switch.description')}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {data.type === 'if_else' && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            style={{ left: '25%' }}
            className="w-3 h-3 bg-green-500 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            style={{ left: '75%' }}
            className="w-3 h-3 bg-red-500 border-2 border-white"
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs px-4 pb-1">
            <span className="text-green-600 font-medium">
              {t('flowBuilder.states.true')}
            </span>
            <span className="text-red-600 font-medium">
              {t('flowBuilder.states.false')}
            </span>
          </div>
        </>
      )}

      {data.type === 'ai_result' && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="text"
            style={{ left: '20%' }}
            className="w-3 h-3 bg-green-500 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="empty"
            style={{ left: '50%' }}
            className="w-3 h-3 bg-gray-500 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="error"
            style={{ left: '80%' }}
            className="w-3 h-3 bg-red-500 border-2 border-white"
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] px-2 pb-1 gap-1">
            <span
              className="px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium"
              title={
                t('flowBuilder.blockPalette.blocks.ai_result.textHelp') || ''
              }
            >
              {t('flowBuilder.states.text')}
            </span>
            <span
              className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium"
              title={
                t('flowBuilder.blockPalette.blocks.ai_result.emptyHelp') || ''
              }
            >
              {t('flowBuilder.states.empty')}
            </span>
            <span
              className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 font-medium"
              title={
                t('flowBuilder.blockPalette.blocks.ai_result.errorHelp') || ''
              }
            >
              {t('flowBuilder.states.error')}
            </span>
          </div>
        </>
      )}

      {data.type === 'switch' && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="case1"
            style={{ left: '20%' }}
            className="w-3 h-3 bg-blue-500 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="case2"
            style={{ left: '40%' }}
            className="w-3 h-3 bg-green-500 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="case3"
            style={{ left: '60%' }}
            className="w-3 h-3 bg-yellow-500 border-2 border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="default"
            style={{ left: '80%' }}
            className="w-3 h-3 bg-gray-500 border-2 border-white"
          />
        </>
      )}

      {data.type !== 'if_else' &&
        data.type !== 'ai_result' &&
        data.type !== 'switch' && (
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 bg-yellow-500 border-2 border-white"
          />
        )}
    </Card>
  );
}
