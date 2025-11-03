'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/ui/dialog';
import { Button } from '@/src/shared/components/ui/button';
import { AlertTriangle, Layers3 } from 'lucide-react';
import { useLanguage } from '@/src/shared/i18n';

interface ConfirmCascadeDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmCascadeDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmCascadeDeleteDialogProps) {
  const { t } = useLanguage();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Каскадное удаление?
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            <div className="space-y-3">
              <p>
                Вы уверены, что хотите запустить{' '}
                <strong>каскадное удаление</strong>?
              </p>

              <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/20 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <Layers3 className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <div className="font-medium mb-1">Что будет удалено:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Все связанные блоки в цепочке</li>
                      <li>• Все соединения между ними</li>
                      <li>• Зависимые элементы схемы</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950/20 dark:border-yellow-800">
                <div className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>⚠️ Внимание:</strong> Это действие нельзя отменить и
                  может повлиять на всю схему workflow.
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 sm:flex-none"
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700"
          >
            <Layers3 className="h-4 w-4 mr-2" />
            Запустить каскадное удаление
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
