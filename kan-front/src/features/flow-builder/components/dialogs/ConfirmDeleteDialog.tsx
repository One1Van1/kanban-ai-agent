'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, Zap } from 'lucide-react';
import { useLanguage } from '@/src/shared/i18n';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onConfirmWithoutAsking?: () => void;
  blockName?: string;
  blockType?: string;
}

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  onConfirmWithoutAsking,
  blockName,
  blockType,
}: ConfirmDeleteDialogProps) {
  const { t } = useLanguage();
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleConfirmWithoutAsking = () => {
    if (onConfirmWithoutAsking) {
      onConfirmWithoutAsking();
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Удалить блок?
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            Вы уверены, что хотите удалить этот блок?
            {blockName && (
              <>
                <br />
                <span className="font-medium text-foreground">{blockName}</span>
              </>
            )}
            {blockType && (
              <>
                <br />
                <span className="text-sm text-muted-foreground">
                  Тип: {blockType}
                </span>
              </>
            )}
            <br />
            <br />
            <span className="text-sm text-muted-foreground">
              Это действие нельзя отменить. Все связи с этим блоком также будут
              удалены.
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Чекбокс "Не спрашивать снова" */}
        <div className="flex items-start space-x-2 px-1 pb-2">
          <input
            id="dont-ask-again"
            type="checkbox"
            checked={dontAskAgain}
            onChange={(e) => setDontAskAgain(e.target.checked)}
            className="h-4 w-4 mt-0.5 rounded border-border text-primary focus:ring-primary flex-shrink-0"
          />
          <label
            htmlFor="dont-ask-again"
            className="text-sm text-muted-foreground cursor-pointer leading-5"
          >
            Не спрашивать подтверждение при удалении блоков
          </label>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Отмена
          </Button>

          {dontAskAgain && onConfirmWithoutAsking && (
            <Button
              variant="secondary"
              onClick={handleConfirmWithoutAsking}
              className="w-full sm:w-auto bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300"
            >
              <Zap className="h-4 w-4 mr-2" />
              Включить быстрое удаление
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
