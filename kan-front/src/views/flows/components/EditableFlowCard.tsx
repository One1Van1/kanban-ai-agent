'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/src/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Input } from '@/src/shared/components/ui/input';
import { Textarea } from '@/src/shared/components/ui/textarea';
import {
  Edit,
  Play,
  Copy,
  Trash2,
  MoreVertical,
  Clock,
  Bot,
  User,
  Check,
  X,
  Pencil,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/components/ui/dropdown-menu';

interface FlowItem {
  flowId: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  agentId?: string;
  blockCount: number;
  metadata?: any;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface EditableFlowCardProps {
  flow: FlowItem;
  onExecute: (flowId: string, flowName: string) => void;
  onClone: (flowId: string, flowName: string) => void;
  onDelete: (flowId: string, flowName: string) => void;
  onDeploy: (flowId: string, flowName: string) => void;
  onUpdateMetadata: (
    flowId: string,
    name: string,
    description?: string,
  ) => Promise<void>;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
  t: (key: string) => string;
}

export function EditableFlowCard({
  flow,
  onExecute,
  onClone,
  onDelete,
  onDeploy,
  onUpdateMetadata,
  getStatusColor,
  formatDate,
  t,
}: EditableFlowCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedName, setEditedName] = useState(flow.name);
  const [editedDescription, setEditedDescription] = useState(
    flow.description || '',
  );
  const [isHoveringName, setIsHoveringName] = useState(false);
  const [isHoveringDescription, setIsHoveringDescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Фокус на инпут при входе в режим редактирования
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingDescription && descriptionTextareaRef.current) {
      descriptionTextareaRef.current.focus();
      descriptionTextareaRef.current.select();
    }
  }, [isEditingDescription]);

  // Обработчик сохранения названия
  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setEditedName(flow.name); // Восстанавливаем исходное значение
      setIsEditingName(false);
      return;
    }

    if (editedName.trim() === flow.name) {
      setIsEditingName(false);
      return;
    }

    try {
      setIsSaving(true);
      await onUpdateMetadata(flow.flowId, editedName.trim(), flow.description);
      setIsEditingName(false);
      toast.success('Название обновлено успешно');
    } catch (error) {
      console.error('Failed to update flow name:', error);
      setEditedName(flow.name); // Восстанавливаем при ошибке
      toast.error('Не удалось обновить название');
    } finally {
      setIsSaving(false);
    }
  };

  // Обработчик сохранения описания
  const handleSaveDescription = async () => {
    if (editedDescription.trim() === (flow.description || '')) {
      setIsEditingDescription(false);
      return;
    }

    try {
      setIsSaving(true);
      await onUpdateMetadata(
        flow.flowId,
        flow.name,
        editedDescription.trim() || undefined,
      );
      setIsEditingDescription(false);
      toast.success('Описание обновлено успешно');
    } catch (error) {
      console.error('Failed to update flow description:', error);
      setEditedDescription(flow.description || '');
      toast.error('Не удалось обновить описание');
    } finally {
      setIsSaving(false);
    }
  };

  // Отмена редактирования названия
  const handleCancelName = () => {
    setEditedName(flow.name);
    setIsEditingName(false);
  };

  // Отмена редактирования описания
  const handleCancelDescription = () => {
    setEditedDescription(flow.description || '');
    setIsEditingDescription(false);
  };

  // Обработчики клавиатуры
  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelName();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSaveDescription();
    } else if (e.key === 'Escape') {
      handleCancelDescription();
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Редактируемое название */}
            <div
              className="relative"
              onMouseEnter={() => !isEditingName && setIsHoveringName(true)}
              onMouseLeave={() => setIsHoveringName(false)}
            >
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    ref={nameInputRef}
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={handleNameKeyDown}
                    onBlur={handleSaveName}
                    className="text-lg font-semibold h-8"
                    disabled={isSaving}
                    maxLength={100}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSaveName}
                    disabled={isSaving}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelName}
                    disabled={isSaving}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group/name">
                  <CardTitle
                    className="text-lg mb-1 truncate cursor-pointer hover:text-primary transition-colors"
                    title={flow.name}
                    onClick={() => setIsEditingName(true)}
                  >
                    {flow.name}
                  </CardTitle>
                  {isHoveringName && (
                    <Pencil
                      className="h-3 w-3 text-muted-foreground opacity-0 group-hover/name:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => setIsEditingName(true)}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Редактируемое описание */}
            <div
              className="mt-1 relative"
              onMouseEnter={() =>
                !isEditingDescription && setIsHoveringDescription(true)
              }
              onMouseLeave={() => setIsHoveringDescription(false)}
            >
              {isEditingDescription ? (
                <div className="space-y-2">
                  <Textarea
                    ref={descriptionTextareaRef}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    onKeyDown={handleDescriptionKeyDown}
                    className="text-sm resize-none min-h-[60px]"
                    disabled={isSaving}
                    maxLength={500}
                    placeholder="Добавьте описание..."
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveDescription}
                      disabled={isSaving}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Сохранить
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelDescription}
                      disabled={isSaving}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Отмена
                    </Button>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ⌘/Ctrl+Enter для сохранения
                    </span>
                  </div>
                </div>
              ) : (
                <div className="group/desc relative">
                  <p
                    className="text-sm text-muted-foreground line-clamp-2 cursor-pointer hover:text-foreground transition-colors pr-6"
                    onClick={() => setIsEditingDescription(true)}
                    title={
                      flow.description || 'Кликните для добавления описания'
                    }
                  >
                    {flow.description || (
                      <span className="italic opacity-60">Нет описания</span>
                    )}
                  </p>
                  {isHoveringDescription && (
                    <Pencil
                      className="h-3 w-3 text-muted-foreground opacity-0 group-hover/desc:opacity-100 transition-opacity cursor-pointer absolute right-0 top-1"
                      onClick={() => setIsEditingDescription(true)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onExecute(flow.flowId, flow.name)}
                disabled={flow.status !== 'active'}
              >
                <Play className="h-4 w-4 mr-2" />
                {t('flows.actions.execute')}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/flows/editor?flowId=${flow.flowId}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t('flows.actions.edit')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClone(flow.flowId, flow.name)}>
                <Copy className="h-4 w-4 mr-2" />
                {t('flows.actions.clone')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeploy(flow.flowId, flow.name)}
                disabled={flow.status !== 'active'}
              >
                <Bot className="h-4 w-4 mr-2" />
                {flow.agentId ? 'Update Agent' : t('flows.actions.deploy')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(flow.flowId, flow.name)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('flows.actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(flow.status)}>
              {t(`flows.status.${flow.status}`)}
            </Badge>
            {flow.agentId && (
              <Badge variant="secondary" className="text-xs">
                <Bot className="h-3 w-3 mr-1" />
                Agent
              </Badge>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{flow.createdBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(flow.updatedAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onExecute(flow.flowId, flow.name)}
              disabled={flow.status !== 'active'}
            >
              <Play className="h-3 w-3 mr-1" />
              {t('flows.actions.execute')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeploy(flow.flowId, flow.name)}
              disabled={flow.status !== 'active'}
              title={flow.agentId ? 'Update Agent' : t('flows.actions.deploy')}
            >
              <Bot className="h-3 w-3" />
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link href={`/flows/editor?flowId=${flow.flowId}`}>
                <Edit className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
