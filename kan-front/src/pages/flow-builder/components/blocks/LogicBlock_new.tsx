'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Button } from '@/src/shared/components/ui/button';
import {
  GitBranch,
  RotateCcw,
  AlertTriangle,
  Brain,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/src/shared/i18n';
import { useBlockEdit } from '@/src/shared/hooks/useBlockEdit';
import {
  LogicInputHandle,
  LogicOutputHandle,
} from './ConnectionHandle';

interface LogicBlockProps {
  data: { type: string; name: string; config: any; isEditing?: boolean };
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
  const { isEditing, toggleEdit, saveEdit, cancelEdit } = useBlockEdit(id);

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
      className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${colorClass} transition-all hover:shadow-md relative`}
    >
      <LogicInputHandle showLabel={true} />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-sm">
          <span className="flex-1 min-w-0">
            {t('flowBuilder.blockPalette.categories.logic')}
          </span>
          <div className="flex items-center gap-1">
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
            </div>
            <div className="flex gap-1 pt-1">
              <Button size="sm" className="text-xs h-6 px-2" onClick={saveEdit}>
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

            {data.type === 'switch' && (
              <div className="text-xs text-muted-foreground">
                {t('flowBuilder.blockPalette.blocks.switch.description')}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Output handles */}
      {data.type === 'if_else' && (
        <>
          <LogicOutputHandle
            condition="true"
            id="true"
            style={{ left: '25%' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="false"
            id="false"
            style={{ left: '75%' }}
            showLabel={false}
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
          <LogicOutputHandle
            condition="text"
            id="text"
            style={{ left: '20%' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="empty"
            id="empty"
            style={{ left: '50%' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="error"
            id="error"
            style={{ left: '80%' }}
            showLabel={false}
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] px-2 pb-1 gap-1">
            <span className="px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium">
              {t('flowBuilder.states.text')}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">
              {t('flowBuilder.states.empty')}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 font-medium">
              {t('flowBuilder.states.error')}
            </span>
          </div>
        </>
      )}

      {data.type === 'switch' && (
        <>
          <LogicOutputHandle
            condition="case1"
            id="case1"
            style={{ left: '20%' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="case2"
            id="case2"
            style={{ left: '40%' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="case3"
            id="case3"
            style={{ left: '60%' }}
            showLabel={false}
          />
          <LogicOutputHandle
            condition="default"
            id="default"
            style={{ left: '80%' }}
            showLabel={false}
          />
        </>
      )}

      {data.type !== 'if_else' &&
        data.type !== 'ai_result' &&
        data.type !== 'switch' && <LogicOutputHandle showLabel={true} />}
    </Card>
  );
}
