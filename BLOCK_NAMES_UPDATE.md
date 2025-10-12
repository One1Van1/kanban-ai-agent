# ✅ **Обновление: Правильные названия блоков**

## 🎯 **Что изменили:**

### **До:**

- При перетаскивании блока на канвас создавался блок с названием "New board_move"
- Drag preview показывал "New Board Move"
- Было видно техническое название типа блока

### **После:**

- ✅ **Блоки создаются с правильными названиями**: "Board Move", "AI Request", "If/Else" и т.д.
- ✅ **Drag preview показывает чистое название**: без "New" приставки
- ✅ **Профессиональные названия**: используются user-friendly имена вместо технических

## 🔧 **Технические изменения:**

### **1. Добавили функцию `getBlockDisplayName`**:

```tsx
const getBlockDisplayName = (blockType: string) => {
  const blockNames = {
    board_move: 'Board Move',
    ai_request: 'AI Request',
    if_else: 'If/Else',
    send_notification: 'Send Notification',
    // ... и другие
  };
  return blockNames[blockType] || beautifyName(blockType);
};
```

### **2. Обновили создание блоков**:

```tsx
// Было:
name: `New ${blockType}`,

// Стало:
name: getBlockDisplayName(blockType),
```

### **3. Улучшили drag preview**:

```tsx
// Было:
dragImage.textContent = `New ${blockType.replace('_', ' ')}`;

// Стало:
dragImage.textContent = getBlockDisplayName(blockType);
```

## 🧪 **Тестирование:**

1. **Откройте Flow Builder**: http://localhost:3001/agents/flow-builder
2. **Перетащите любой блок** из палитры на канвас
3. **Проверьте drag preview**: должно показывать красивое название (например, "Board Move")
4. **Проверьте созданный блок**: должен иметь правильное название без "New"

## 📋 **Примеры названий:**

| Тип блока           | Старое название         | Новое название      |
| ------------------- | ----------------------- | ------------------- |
| `board_move`        | "New board_move"        | "Board Move"        |
| `ai_request`        | "New ai_request"        | "AI Request"        |
| `if_else`           | "New if_else"           | "If/Else"           |
| `send_notification` | "New send_notification" | "Send Notification" |
| `wait_response`     | "New wait_response"     | "Wait Response"     |

**Результат:** Теперь и drag preview, и созданные блоки имеют красивые, профессиональные названия! 🎉
