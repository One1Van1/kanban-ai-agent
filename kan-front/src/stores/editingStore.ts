import { create } from 'zustand';

interface EditingState {
  editingBlocks: Set<string>;
  toggleBlockEdit: (blockId: string) => void;
  setBlockEdit: (blockId: string, isEditing: boolean) => void;
  isBlockEditing: (blockId: string) => boolean;
}

export const useEditingStore = create<EditingState>((set, get) => ({
  editingBlocks: new Set(),

  toggleBlockEdit: (blockId: string) => {
    set((state) => {
      const newEditingBlocks = new Set(state.editingBlocks);
      if (newEditingBlocks.has(blockId)) {
        newEditingBlocks.delete(blockId);
      } else {
        newEditingBlocks.add(blockId);
      }
      return { editingBlocks: newEditingBlocks };
    });
  },

  setBlockEdit: (blockId: string, isEditing: boolean) => {
    set((state) => {
      const newEditingBlocks = new Set(state.editingBlocks);
      if (isEditing) {
        newEditingBlocks.add(blockId);
      } else {
        newEditingBlocks.delete(blockId);
      }
      return { editingBlocks: newEditingBlocks };
    });
  },

  isBlockEditing: (blockId: string) => {
    return get().editingBlocks.has(blockId);
  },
}));
