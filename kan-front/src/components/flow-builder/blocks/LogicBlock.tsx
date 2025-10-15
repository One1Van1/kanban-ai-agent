'use client';

import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
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
import { useBlockEdit } from '@/src/hooks/useBlockEdit';
import {
  LogicInputHandle,
  LogicOutputHandle,
  ConnectionHandle,
} from '../components/ConnectionHandle';

interface LogicBlockProps {
  data: { type: string; name: string; config: any; isEditing?: boolean };
  id: string;
  selected: boolean;
  onDeleteBlock?: (nodeId: string) => void;
  onUpdateBlock?: (blockId: string, newData: Partial<any>) => void;
}

export function LogicBlock({
  data,
  id,
  selected,
  onDeleteBlock,
  onUpdateBlock,
}: LogicBlockProps) {
  const { t } = useLanguage();
  const {
    isEditing,
    toggleEdit,
    saveEdit,
    cancelEdit,
    updateFormData,
    registerFieldRef,
  } = useBlockEdit(id, onUpdateBlock);
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
    <div className="relative">
      {/* Входной handle - ВЫНЕСЕН ЗА ГРАНИЦЫ блока */}
      <LogicInputHandle showLabel={true} />

      <Card
        className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${colorClass} transition-all hover:shadow-md`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-start gap-2 text-sm">
            <span className="flex-1 min-w-0">
              {t('flowBuilder.blockPalette.categories.logic')}
            </span>
            <div className="flex items-center gap-1">
              {/* Кнопка редактирования только для блоков, которые можно настраивать */}
              {data.type !== 'switch' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border border-border/40 hover:border-border hover:bg-background/50"
                  onClick={toggleEdit}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              {onDeleteBlock && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBlock?.(id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </CardTitle>

          {/* Иконка и название действия под заголовком */}
          <div className="flex items-center gap-2 mt-2">
            {renderIcon()}
            <Badge
              variant="secondary"
              className="text-xs px-2 py-1 max-w-[150px] text-center leading-tight whitespace-normal"
            >
              {t(`flowBuilder.blockPalette.blocks.${data.type}.name`)}
            </Badge>
          </div>
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
                      onChange={(e) =>
                        updateFormData('condition', {
                          ...data.config?.condition,
                          variable: e.target.value,
                        })
                      }
                      ref={(el) => registerFieldRef('condition.variable', el)}
                    />
                    <select
                      defaultValue={data.config?.condition?.operator || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('condition', {
                          ...data.config?.condition,
                          operator: e.target.value,
                        })
                      }
                      ref={(el) => registerFieldRef('condition.operator', el)}
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
                      onChange={(e) =>
                        updateFormData('condition', {
                          ...data.config?.condition,
                          value: e.target.value,
                        })
                      }
                      ref={(el) => registerFieldRef('condition.value', el)}
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
                      onChange={(e) =>
                        updateFormData('collection', e.target.value)
                      }
                      ref={(el) => registerFieldRef('collection', el)}
                    />
                    <input
                      type="text"
                      placeholder="Item Variable"
                      defaultValue={data.config?.itemVariable || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('itemVariable', e.target.value)
                      }
                      ref={(el) => registerFieldRef('itemVariable', el)}
                    />
                    <input
                      type="number"
                      placeholder="Max Iterations"
                      defaultValue={data.config?.maxIterations || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData(
                          'maxIterations',
                          parseInt(e.target.value) || 0,
                        )
                      }
                      ref={(el) => registerFieldRef('maxIterations', el)}
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
                      onChange={(e) =>
                        updateFormData('errorVariable', e.target.value)
                      }
                      ref={(el) => registerFieldRef('errorVariable', el)}
                    />
                    <select
                      defaultValue={data.config?.errorType || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFormData('errorType', e.target.value)
                      }
                      ref={(el) => registerFieldRef('errorType', el)}
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
                      onChange={(e) => updateFormData('responseVariable', e.target.value)}
                      ref={(el) => registerFieldRef('responseVariable', el)}
                    />
                    <select
                      defaultValue={data.config?.aiModel || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateFormData('aiModel', e.target.value)}
                      ref={(el) => registerFieldRef('aiModel', el)}
                    >
                      <option value="">Выберите AI модель</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                      <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                      <option value="gemini-pro">Gemini Pro</option>
                      <option value="llama-2">Llama 2</option>
                    </select>
                    <textarea
                      placeholder="AI Prompt (опционально)"
                      defaultValue={data.config?.prompt || ''}
                      className="w-full text-xs px-2 py-1 border rounded bg-background min-h-[60px] resize-none"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateFormData('prompt', e.target.value)}
                      ref={(el) => registerFieldRef('prompt', el)}
                      rows={3}
                    />
                  </>
                )}
              </div>
              <div className="flex gap-1 pt-1">
                <Button
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={(e) => saveEdit(e, data.config)}
                >
                  {t('flowBuilder.save')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={cancelEdit}
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
                    {data.config?.itemVariable ||
                      t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('flowBuilder.fields.maxIterations')}:{' '}
                    {data.config?.maxIterations ||
                      t('flowBuilder.fields.notSet')}
                  </div>
                </>
              )}

              {/* Отображение для try_catch */}
              {data.type === 'try_catch' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.errorVariable')}:{' '}
                    {data.config?.errorVariable ||
                      t('flowBuilder.fields.notSet')}
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
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('flowBuilder.fields.aiModel')}:{' '}
                    {data.config?.aiModel || t('flowBuilder.fields.notSet')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Prompt:{' '}
                    {data.config?.prompt ? 
                      (data.config.prompt.length > 50 ? 
                        data.config.prompt.substring(0, 50) + '...' : 
                        data.config.prompt
                      ) : 
                      t('flowBuilder.fields.notSet')
                    }
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

        {/* Лейблы для веток внутри Card */}
        {data.type === 'if_else' && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs px-4 pb-1">
            <span className="text-green-600 font-medium">
              {t('flowBuilder.states.true')}
            </span>
            <span className="text-red-600 font-medium">
              {t('flowBuilder.states.false')}
            </span>
          </div>
        )}

        {data.type === 'ai_result' && (
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
        )}
      </Card>

      {/* Множественные выходные handles - ВЫНЕСЕНЫ ЗА ГРАНИЦЫ блока */}
      {data.type === 'if_else' && (
        <>
          <div
            key={`${id}-true-wrapper`}
            style={{
              position: 'absolute',
              left: '15%', // Выравниваем с лейблом "Истина"
              bottom: '2px', // Прямо на границе блока
              transform: 'translateX(-50%)', // Центрируем handle
              zIndex: 1000,
            }}
          >
            <ConnectionHandle
              type="source"
              position={Position.Bottom}
              id="true"
              color="green"
              showLabel={false}
              style={{ position: 'static' }}
            />
          </div>
          <div
            key={`${id}-false-wrapper`}
            style={{
              position: 'absolute',
              left: '85%', // Выравниваем с лейблом "Ложь"
              bottom: '2px', // Прямо на границе блока
              transform: 'translateX(-50%)', // Центрируем handle
              zIndex: 1000,
            }}
          >
            <ConnectionHandle
              type="source"
              position={Position.Bottom}
              id="false"
              color="red"
              showLabel={false}
              style={{ position: 'static' }}
            />
          </div>
        </>
      )}

      {data.type === 'ai_result' && (
        <>
          <LogicOutputHandle
            condition="text"
            id="text"
            style={{ left: '25%', transform: 'translateX(-50%)' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="empty"
            id="empty"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="error"
            id="error"
            style={{ left: '75%', transform: 'translateX(-50%)' }}
            showLabel={false}
          />
        </>
      )}

      {data.type === 'switch' && (
        <>
          <LogicOutputHandle
            condition="case1"
            id="case1"
            style={{ left: '15%', transform: 'translateX(-50%)' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="case2"
            id="case2"
            style={{ left: '35%', transform: 'translateX(-50%)' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="case3"
            id="case3"
            style={{ left: '65%', transform: 'translateX(-50%)' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="default"
            id="default"
            style={{ left: '85%', transform: 'translateX(-50%)' }}
            showLabel={false}
          />
        </>
      )}

      {/* Выходные handles - ВЫНЕСЕНЫ ЗА ГРАНИЦЫ блока */}
      {data.type !== 'if_else' &&
        data.type !== 'ai_result' &&
        data.type !== 'switch' && <LogicOutputHandle showLabel={true} />}
    </div>
  );
}
