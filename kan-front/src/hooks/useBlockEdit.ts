import { useCallback } from 'react';
import { useEditingStore } from '@/src/stores/editingStore';

export function useBlockEdit(id: string) {
  const { toggleBlockEdit, setBlockEdit, isBlockEditing } = useEditingStore();
  const isEditing = isBlockEditing(id);

  const toggleEdit = useCallback(
    (e: React.MouseEvent) => {
      console.log('🎯 Toggle edit for block:', id, 'current:', isEditing);
      e.stopPropagation();
      toggleBlockEdit(id);
    },
    [id, toggleBlockEdit],
  );

  const saveEdit = useCallback(
    (e: React.MouseEvent) => {
      console.log('💾 Save edit for block:', id);
      e.stopPropagation();
      setBlockEdit(id, false);
      // TODO: Здесь можно добавить логику сохранения изменений
    },
    [id, setBlockEdit],
  );

  const cancelEdit = useCallback(
    (e: React.MouseEvent) => {
      console.log('❌ Cancel edit for block:', id);
      e.stopPropagation();
      setBlockEdit(id, false);
    },
    [id, setBlockEdit],
  );

  return { isEditing, toggleEdit, saveEdit, cancelEdit };
}
