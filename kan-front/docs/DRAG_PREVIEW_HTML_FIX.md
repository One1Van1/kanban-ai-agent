# Fix Drag Preview - HTML подход

## 🎯 Проблема

Drag preview блоков показывал белый прямоугольник вместо полноценного блока.

## 🔍 Найденная причина:

1. **Canvas подход не работал** - setDragImage плохо работает с canvas элементами
2. **setTimeout проблема** - setDragImage нужно вызывать синхронно в handleDragStart
3. **React компоненты** - не подходят для drag image

## ✅ Решение - HTML div подход:

### 1. Синхронный вызов setDragImage

```typescript
// Создаем реальный блок preview СИНХРОННО
const previewElement = createBlockPreview(blockType, blockCategory);

// Устанавливаем drag image сразу (синхронно)
if (previewElement) {
  event.dataTransfer.setDragImage(previewElement, 144, 70);
}
```

### 2. HTML div вместо Canvas

```typescript
// Создаем div элемент который выглядит точно как блок на канвасе
const previewDiv = document.createElement('div');

// Точные цвета как у блоков на канвасе
const categoryStyles = {
  trigger: 'background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;',
  context: 'background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8;',
  logic: 'background: #fefce8; border: 1px solid #fef08a; color: #a16207;',
  action: 'background: #faf5ff; border: 1px solid #e9d5ff; color: #7c2d12;',
  wait: 'background: #fff7ed; border: 1px solid #fed7aa; color: #c2410c;',
};
```

### 3. Точная структура блока

```typescript
previewDiv.innerHTML = `
  <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 12px;">
    <div style="width: 16px; height: 16px; background: currentColor; border-radius: 2px; opacity: 0.6;"></div>
    <div style="flex: 1; font-size: 14px; font-weight: 500;">
      ${blockInfo.categoryName}
    </div>
    <div style="background: rgba(0,0,0,0.1); color: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px;">
      ${blockInfo.name}
    </div>
  </div>
  <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">
    ${blockInfo.name}
  </div>
  <div style="font-size: 12px; opacity: 0.7; line-height: 1.4;">
    ${configText}
  </div>
`;
```

### 4. Handle'ы как DOM элементы

```typescript
const handleStyle = `
  position: absolute;
  width: 12px;
  height: 12px;
  background: ${handleColors[blockCategory]};
  border: 2px solid white;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
`;

if (blockCategory !== 'trigger') {
  topHandle.style.cssText = handleStyle + 'top: -6px;';
  previewDiv.appendChild(topHandle);
}

bottomHandle.style.cssText = handleStyle + 'bottom: -6px;';
previewDiv.appendChild(bottomHandle);
```

## 🎨 Результат:

Теперь при перетаскивании блоков:

- ✅ **Видимый блок** вместо белого прямоугольника
- ✅ **Точные цвета** по категориям (зеленый для trigger, синий для context и т.д.)
- ✅ **Правильный размер** 288px (w-72)
- ✅ **Реальная информация** (Board: JIRA, Model: CLAUDE и т.д.)
- ✅ **Handle'ы** для подключений (цветные круги)
- ✅ **Структура как у блоков** на канвасе

## 🔧 Ключевые изменения:

1. **handleDragStart**: Убрали setTimeout, вызываем setDragImage синхронно
2. **createBlockPreview**: HTML div вместо Canvas с точными стилями
3. **Позиционирование**: top: -2000px чтобы не было видно в UI
4. **Cleanup**: Удаляем preview элемент через 1 секунду

Теперь drag preview должен показывать полноценный блок! 🎉
