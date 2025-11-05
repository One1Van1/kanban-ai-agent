'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Button } from '@/src/shared/components/ui/button';
import {
  FileText,
  Variable,
  Pencil,
  Trash2,
  FileImage,
  Image,
  Database,
  Brain,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLanguage } from '@/src/shared/i18n';
import { useBlockEdit } from '@/src/shared/hooks/useBlockEdit';
import { ContextInputHandle, ContextOutputHandle } from './ConnectionHandle';
import {
  OutputVariableField,
  OutputVariableDisplay,
} from '../fields/OutputVariableField';
import { AutoExpandTextarea } from '../fields/AutoExpandTextarea';

interface ContextBlockProps {
  data: {
    type: string;
    name: string;
    config: any;
  };
  id: string;
  selected: boolean;
  onDeleteBlock?: (nodeId: string) => void;
  onUpdateBlock?: (blockId: string, newData: Partial<any>) => void;
}

export function ContextBlock({
  data,
  id,
  selected,
  onDeleteBlock,
  onUpdateBlock,
}: ContextBlockProps) {
  const { t } = useLanguage();

  const {
    isEditing,
    toggleEdit,
    saveEdit,
    cancelEdit,
    updateFormData,
    registerFieldRef,
  } = useBlockEdit(id, onUpdateBlock);

  const getIcon = () => {
    switch (data.type) {
      case 'extract_files':
        return <FileText className="w-4 h-4" />;
      case 'extract_text':
        return <FileImage className="w-4 h-4" />;
      case 'extract_media':
        return <Image className="w-4 h-4" />;
      case 'get_data':
        return <Database className="w-4 h-4" />;
      case 'rag_processing':
        return <Brain className="w-4 h-4" />;
      case 'transform_data':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Variable className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-200';
  };

  return (
    <div className="relative">
      {/* Входной handle - ВЫНЕСЕН ЗА ГРАНИЦЫ блока */}
      <ContextInputHandle showLabel={true} />

      <Card
        className={`w-72 ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} ${getColor()} transition-all hover:shadow-md`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-start gap-2 text-sm">
            <span className="flex-1 min-w-0">
              {t('flowBuilder.blockPalette.categories.context')}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 border border-border/40 hover:border-border hover:bg-background/50"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleEdit(e);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
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
            {getIcon()}
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
                {/* Поля для всех типов */}
                <AutoExpandTextarea
                  placeholder={t('flowBuilder.fields.variable')}
                  defaultValue={data.config?.variableName || ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateFormData('variableName', e.target.value)
                  }
                  fieldRef={(el) => registerFieldRef('variableName', el)}
                  minRows={1}
                  maxRows={3}
                />
                <AutoExpandTextarea
                  placeholder={t('flowBuilder.fields.source')}
                  defaultValue={data.config?.source || ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateFormData('source', e.target.value)}
                  fieldRef={(el) => registerFieldRef('source', el)}
                  minRows={1}
                  maxRows={3}
                />

                {/* Поле типов только для extract_files */}
                {data.type === 'extract_files' && (
                  <AutoExpandTextarea
                    placeholder={t('flowBuilder.fields.types')}
                    defaultValue={
                      data.config?.filter?.fileType?.join(', ') || ''
                    }
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const types = e.target.value
                        .split(',')
                        .map((t) => t.trim());
                      updateFormData('filter', {
                        ...data.config?.filter,
                        fileType: types,
                      });
                    }}
                    fieldRef={(el) => registerFieldRef('fileType', el)}
                    minRows={1}
                    maxRows={3}
                  />
                )}

                {/* Поля для transform_data */}
                {data.type === 'transform_data' && (
                  <>
                    {/* Тип преобразования */}
                    <select
                      className="w-full text-xs px-2 py-1 border rounded bg-background"
                      value={data.config?.transformationType || 'javascript'}
                      onChange={(e) =>
                        updateFormData('transformationType', e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      ref={(el) => registerFieldRef('transformationType', el)}
                    >
                      <option value="">
                        {t('flowBuilder.fields.selectTransformationType')}
                      </option>
                      <option value="javascript">JavaScript Expression</option>
                      <option value="map">Map</option>
                      <option value="filter">Filter</option>
                      <option value="reduce">Reduce</option>
                      <option value="sort">Sort</option>
                      <option value="groupBy">Group By</option>
                      <option value="format">Format Conversion</option>
                    </select>

                    {/* JavaScript код или Map expression */}
                    {(data.config?.transformationType === 'javascript' ||
                      data.config?.transformationType === 'map' ||
                      data.config?.transformationType === 'reduce' ||
                      !data.config?.transformationType) && (
                      <AutoExpandTextarea
                        placeholder={
                          data.config?.transformationType === 'map'
                            ? t('flowBuilder.fields.mapExpressionPlaceholder')
                            : t(
                                'flowBuilder.fields.transformationCodePlaceholder',
                              )
                        }
                        defaultValue={
                          data.config?.transformationCode ||
                          data.config?.mapExpression ||
                          ''
                        }
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateFormData(
                            data.config?.transformationType === 'map'
                              ? 'mapExpression'
                              : 'transformationCode',
                            e.target.value,
                          )
                        }
                        fieldRef={(el) =>
                          registerFieldRef('transformationCode', el)
                        }
                        monospace={true}
                        minRows={2}
                        maxRows={8}
                      />
                    )}

                    {/* Filter condition */}
                    {data.config?.transformationType === 'filter' && (
                      <AutoExpandTextarea
                        placeholder={t(
                          'flowBuilder.fields.filterConditionPlaceholder',
                        )}
                        defaultValue={data.config?.filterCondition || ''}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateFormData('filterCondition', e.target.value)
                        }
                        fieldRef={(el) =>
                          registerFieldRef('filterCondition', el)
                        }
                        monospace={true}
                        minRows={1}
                        maxRows={4}
                      />
                    )}

                    {/* Sort options */}
                    {data.config?.transformationType === 'sort' && (
                      <>
                        <AutoExpandTextarea
                          placeholder={t('flowBuilder.fields.sortField')}
                          defaultValue={data.config?.sortField || ''}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            updateFormData('sortField', e.target.value)
                          }
                          fieldRef={(el) => registerFieldRef('sortField', el)}
                          minRows={1}
                          maxRows={2}
                        />
                        <select
                          className="w-full text-xs px-2 py-1 border rounded bg-background"
                          value={data.config?.sortOrder || 'asc'}
                          onChange={(e) =>
                            updateFormData('sortOrder', e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          ref={(el) => registerFieldRef('sortOrder', el)}
                        >
                          <option value="asc">
                            {t('flowBuilder.fields.sortAsc')}
                          </option>
                          <option value="desc">
                            {t('flowBuilder.fields.sortDesc')}
                          </option>
                        </select>
                      </>
                    )}

                    {/* Group By field */}
                    {data.config?.transformationType === 'groupBy' && (
                      <AutoExpandTextarea
                        placeholder={t(
                          'flowBuilder.fields.groupByFieldPlaceholder',
                        )}
                        defaultValue={data.config?.groupByField || ''}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateFormData('groupByField', e.target.value)
                        }
                        fieldRef={(el) => registerFieldRef('groupByField', el)}
                        minRows={1}
                        maxRows={2}
                      />
                    )}

                    {/* Output Format */}
                    {data.config?.transformationType === 'format' && (
                      <select
                        className="w-full text-xs px-2 py-1 border rounded bg-background"
                        value={data.config?.outputFormat || 'json'}
                        onChange={(e) =>
                          updateFormData('outputFormat', e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        ref={(el) => registerFieldRef('outputFormat', el)}
                      >
                        <option value="">
                          {t('flowBuilder.fields.selectOutputFormat')}
                        </option>
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                        <option value="xml">XML</option>
                        <option value="excel">Excel</option>
                      </select>
                    )}
                  </>
                )}
              </div>

              {/* Output Variable Field - Universal for ALL context types */}
              <OutputVariableField
                value={data.config?.outputVariable || ''}
                onChange={(value) => updateFormData('outputVariable', value)}
                fieldRef={(el) => registerFieldRef('outputVariable', el)}
              />

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
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelEdit(e);
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

              {/* Общие поля для всех типов контекста */}
              <div className="text-xs text-muted-foreground mb-1">
                <span className="font-medium">
                  {t('flowBuilder.fields.variable')}:
                </span>{' '}
                <span className="break-words whitespace-pre-wrap">
                  {data.config?.variableName || t('flowBuilder.fields.notSet')}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                <span className="font-medium">
                  {t('flowBuilder.fields.source')}:
                </span>{' '}
                <span className="break-words whitespace-pre-wrap">
                  {data.config?.source || t('flowBuilder.fields.notSet')}
                </span>
              </div>

              {/* Дополнительные поля для extract_files */}
              {data.type === 'extract_files' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium">
                      {t('flowBuilder.fields.types')}:
                    </span>{' '}
                    <span className="break-words whitespace-pre-wrap">
                      {data.config?.filter?.fileType?.join(', ') ||
                        t('flowBuilder.fields.notSet')}
                    </span>
                  </div>
                </>
              )}

              {/* Дополнительные поля для transform_data */}
              {data.type === 'transform_data' && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium">
                      {t('flowBuilder.fields.transformationType')}:
                    </span>{' '}
                    <span className="break-words">
                      {data.config?.transformationType ||
                        t('flowBuilder.fields.notSet')}
                    </span>
                  </div>
                  {data.config?.transformationCode && (
                    <div className="text-xs text-muted-foreground mb-1 font-mono bg-muted/30 p-2 rounded break-words whitespace-pre-wrap">
                      {data.config.transformationCode}
                    </div>
                  )}
                  {data.config?.filterCondition && (
                    <div className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium">Filter:</span>{' '}
                      <span className="break-words whitespace-pre-wrap font-mono">
                        {data.config.filterCondition}
                      </span>
                    </div>
                  )}
                  {data.config?.sortField && (
                    <div className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium">Sort:</span>{' '}
                      <span className="break-words">
                        {data.config.sortField} (
                        {data.config.sortOrder || 'asc'})
                      </span>
                    </div>
                  )}
                  {data.config?.groupByField && (
                    <div className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium">Group by:</span>{' '}
                      <span className="break-words whitespace-pre-wrap">
                        {data.config.groupByField}
                      </span>
                    </div>
                  )}
                  {data.config?.outputFormat && (
                    <div className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium">Format:</span>{' '}
                      <span className="break-words">
                        {data.config.outputFormat}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Output Variable Display - Universal for ALL context types */}
              <OutputVariableDisplay
                value={data.config?.outputVariable}
                className="mt-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Выходной handle - ВЫНЕСЕН ЗА ГРАНИЦЫ блока */}
      <ContextOutputHandle showLabel={true} />
    </div>
  );
}
