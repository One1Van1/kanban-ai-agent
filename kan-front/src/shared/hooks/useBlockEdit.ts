import { useCallback, useRef } from 'react';
import { useEditingStore } from '@/src/shared/stores/editingStore';

export function useBlockEdit(
  id: string,
  onUpdateBlock?: (blockId: string, newData: Partial<any>) => void,
) {
  const { toggleBlockEdit, setBlockEdit, isBlockEditing } = useEditingStore();
  const isEditing = isBlockEditing(id);
  const formDataRef = useRef<Record<string, any>>({});
  const fieldRefsRef = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  >({});

  const toggleEdit = useCallback(
    (e: React.MouseEvent) => {
      console.log('🎯 Toggle edit for block:', id, 'current:', isEditing);
      e.stopPropagation();
      toggleBlockEdit(id);
    },
    [id, toggleBlockEdit],
  );

  const saveEdit = useCallback(
    (e: React.MouseEvent, currentConfig?: any) => {
      e.stopPropagation();

      // Собираем данные из полей формы
      const formValues: Record<string, any> = {};
      Object.entries(fieldRefsRef.current).forEach(([fieldName, element]) => {
        if (element) {
          let value: any;

          // Для checkbox читаем checked, а не value!
          if (element.type === 'checkbox') {
            value = (element as HTMLInputElement).checked;
          } else {
            value = element.value;
          }

          // Обрабатываем числовые поля
          if (element.type === 'number') {
            value = parseInt(element.value) || 0;
          }

          // Обрабатываем поля для LogicBlock condition
          if (fieldName.startsWith('condition.')) {
            const conditionField = fieldName.split('.')[1];
            if (!formValues['condition']) {
              formValues['condition'] = { ...currentConfig?.condition };
            }
            formValues['condition'][conditionField] = value;
          }
          // Обрабатываем списки через запятую для fileType
          else if (fieldName === 'fileType' && typeof value === 'string') {
            const types = value
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t);
            // Создаем структуру filter.fileType
            formValues['filter'] = {
              ...currentConfig?.filter,
              fileType: types,
            };
          } else {
            formValues[fieldName] = value;
          }
        }
      });

      // Сохраняем изменения через функцию onUpdateBlock
      if (onUpdateBlock) {
        // Мержим данные из формы и formDataRef
        // ВАЖНО: formValues перезаписывает formDataRef (приоритет у зарегистрированных полей)
        const allFormData = {
          ...formValues,
          ...formDataRef.current, // ← данные из onChange (чекбоксы, селекты)
        };

        if (Object.keys(allFormData).length > 0) {
          // Мержим существующий config с новыми данными
          const mergedConfig = {
            ...currentConfig,
            ...allFormData,
          };

          onUpdateBlock(id, {
            config: mergedConfig,
          });
        }
      }

      // Выключаем режим редактирования
      setBlockEdit(id, false);

      // Очищаем временные данные
      formDataRef.current = {};
      fieldRefsRef.current = {};
    },
    [id, setBlockEdit, onUpdateBlock],
  );

  const cancelEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setBlockEdit(id, false);
      // Очищаем временные данные
      formDataRef.current = {};
      fieldRefsRef.current = {};
    },
    [id, setBlockEdit],
  );

  const updateFormData = useCallback((field: string, value: any) => {
    formDataRef.current = {
      ...formDataRef.current,
      [field]: value,
    };
  }, []);

  const registerFieldRef = useCallback(
    (
      fieldName: string,
      element:
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | null,
    ) => {
      if (element) {
        fieldRefsRef.current[fieldName] = element;
      }
    },
    [],
  );

  return {
    isEditing,
    toggleEdit,
    saveEdit,
    cancelEdit,
    updateFormData,
    registerFieldRef,
  };
}
