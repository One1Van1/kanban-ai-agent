'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface DialogContextType {
  showAlert: (
    message: string,
    type?: 'success' | 'error' | 'info' | 'warning',
  ) => void;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    message: string;
    title: string;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    message: '',
    title: '',
  });

  const showAlert = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
  ) => {
    setAlertState({
      isOpen: true,
      message,
      type,
    });
  };

  const showConfirm = (
    message: string,
    title: string = 'Подтверждение',
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        title,
        resolve,
      });
    });
  };

  const handleConfirm = (result: boolean) => {
    if (confirmState.resolve) {
      confirmState.resolve(result);
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false, resolve: undefined }));
  };

  const getAlertIcon = () => {
    switch (alertState.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertTitle = () => {
    switch (alertState.type) {
      case 'success':
        return 'Успешно';
      case 'error':
        return 'Ошибка';
      case 'warning':
        return 'Предупреждение';
      default:
        return 'Информация';
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* Alert Toast - теперь по центру как диалог */}
      <Dialog
        open={alertState.isOpen}
        onOpenChange={() =>
          setAlertState((prev) => ({ ...prev, isOpen: false }))
        }
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getAlertIcon()}
              {getAlertTitle()}
            </DialogTitle>
            <DialogDescription>{alertState.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() =>
                setAlertState((prev) => ({ ...prev, isOpen: false }))
              }
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmState.isOpen}
        onOpenChange={() => handleConfirm(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmState.title}</DialogTitle>
            <DialogDescription>{confirmState.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleConfirm(false)}>
              Отмена
            </Button>
            <Button onClick={() => handleConfirm(true)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
