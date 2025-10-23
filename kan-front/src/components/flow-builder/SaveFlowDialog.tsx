'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface SaveFlowData {
  name: string;
  description: string;
}

interface SaveFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: SaveFlowData) => void;
  initialName?: string;
  initialDescription?: string;
  title?: string;
  submitLabel?: string;
}

export function SaveFlowDialog({
  open,
  onOpenChange,
  onSave,
  initialName = '',
  initialDescription = '',
  title = 'Сохранить Flow',
  submitLabel = 'Сохранить',
}: SaveFlowDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [nameError, setNameError] = useState('');

  // Обновляем поля при изменении initial values
  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription, open]);

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setNameError('Название не может быть пустым');
      return false;
    }
    if (value.length < 3) {
      setNameError('Название должно содержать минимум 3 символа');
      return false;
    }
    if (value.length > 100) {
      setNameError('Название слишком длинное (максимум 100 символов)');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (nameError) {
      validateName(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(name)) {
      return;
    }

    // Ограничиваем длину описания
    const trimmedDescription = description.trim().substring(0, 500);

    onSave({
      name: name.trim(),
      description: trimmedDescription,
    });

    // Не закрываем диалог здесь - родительский компонент сделает это после успешного сохранения
  };

  const handleCancel = () => {
    setNameError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Укажите название и описание для вашего Flow. Название обязательно.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="flow-name">
                Название <span className="text-red-500">*</span>
              </Label>
              <Input
                id="flow-name"
                placeholder="Введите название Flow..."
                value={name}
                onChange={handleNameChange}
                className={nameError ? 'border-red-500' : ''}
                autoFocus
              />
              {nameError && <p className="text-sm text-red-500">{nameError}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="flow-description">Описание</Label>
              <Textarea
                id="flow-description"
                placeholder="Опишите назначение Flow (необязательно)..."
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  // Ограничиваем ввод 500 символами
                  if (value.length <= 500) {
                    setDescription(value);
                  }
                }}
                rows={4}
                className="resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {description.length}/500 символов
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
