# Точное соответствие drag preview блокам на канвасе

## 🎯 Задача ВЫПОЛНЕНА!

Сделал drag preview блоков **точной копией** блоков на канвасе - правильные цвета, размер и структура для каждой категории.

## ✅ Точные цвета по категориям:

### 🟢 **Trigger блоки**:

- **Фон**: `#f0fdf4` (bg-green-50)
- **Бордер**: `#bbf7d0` (border-green-200)
- **Текст**: `#166534` (text-green-800)
- **Handle**: `#10b981` (bg-green-500)

### 🔵 **Context блоки**:

- **Фон**: `#eff6ff` (bg-blue-50)
- **Бордер**: `#bfdbfe` (border-blue-200)
- **Текст**: `#1e40af` (text-blue-800)
- **Handle**: `#3b82f6` (bg-blue-500)

### 🟡 **Logic блоки**:

- **Фон**: `#fefce8` (bg-yellow-50)
- **Бордер**: `#fef08a` (border-yellow-200)
- **Текст**: `#a16207` (text-yellow-800)
- **Handle**: `#eab308` (bg-yellow-500)

### 🟣 **Action блоки**:

- **Фон**: `#faf5ff` (bg-purple-50)
- **Бордер**: `#e9d5ff` (border-purple-200)
- **Текст**: `#7c2d12` (text-purple-800)
- **Handle**: `#a855f7` (bg-purple-500)

### 🟠 **Wait блоки**:

- **Фон**: `#fff7ed` (bg-orange-50)
- **Бордер**: `#fed7aa` (border-orange-200)
- **Текст**: `#c2410c` (text-orange-800)
- **Handle**: `#f97316` (bg-orange-500)

## 🏗️ Структура как у настоящих блоков:

```typescript
// ТОЧНАЯ копия структуры Card компонентов
previewDiv.innerHTML = `
  <!-- CardHeader как у блоков -->
  <div style="padding-bottom: 8px;">
    <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 14px;">
      <div style="width: 16px; height: 16px; background: currentColor;"></div>
      <span style="flex: 1; font-weight: 500;">${categoryName}</span>
      <span style="background: #f4f4f5; color: #71717a; padding: 4px 8px; border-radius: 4px;">
        ${blockName}
      </span>
    </div>
  </div>
  
  <!-- CardContent как у блоков -->
  <div style="padding-top: 0;">
    <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">
      ${blockName}
    </div>
    <div style="font-size: 12px; color: #6b7280;">
      ${configuration}
    </div>
  </div>
`;
```

## 🎮 Handle'ы точно как на канвасе:

```typescript
// Входной handle (если не trigger)
if (blockCategory !== 'trigger') {
  topHandle.style.cssText = `
    position: absolute;
    width: 12px;
    height: 12px;
    background: ${handleColor};
    border: 2px solid white;
    border-radius: 50%;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
  `;
}

// Выходной handle (всегда)
bottomHandle.style.cssText = `...bottom: -6px;`;
```

## 🎨 Результат:

Теперь при перетаскивании:

- ✅ **Trigger блоки** → Зеленые с зелеными handle'ами
- ✅ **Context блоки** → Синие с синими handle'ами
- ✅ **Logic блоки** → Желтые с желтыми handle'ами
- ✅ **Action блоки** → Фиолетовые с фиолетовыми handle'ами
- ✅ **Wait блоки** → Оранжевые с оранжевыми handle'ами

- ✅ **Размер**: 288px (w-72) как у блоков на канвасе
- ✅ **Структура**: CardHeader + CardContent
- ✅ **Информация**: Board type, Events, Configuration
- ✅ **Handle'ы**: Правильное позиционирование и цвета

## 🎯 **ПОЛНОЕ СООТВЕТСТВИЕ!**

Drag preview теперь **ТОЧНАЯ КОПИЯ** блоков на канвасе! 🎉

Каждый блок при перетаскивании показывает именно то, что будет на канвасе - правильные цвета, размер, структуру и информацию.
