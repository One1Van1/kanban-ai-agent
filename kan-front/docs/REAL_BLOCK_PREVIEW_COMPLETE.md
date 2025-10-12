# Real Block Preview - Полная реализация

## 🎯 Цель

Сделать drag preview блоков полностью идентичным блокам на канвасе - тот же размер, контент, handle'ы и информация.

## ✅ Реализованные изменения

### 1. Полноценная структура блока в preview

```tsx
const PreviewBlock = () => {
  const mockData = {
    type: blockType,
    name: getBlockDisplayName(blockType),
    config: getDefaultBlockConfig(blockType),
  };

  return (
    <Card
      className={`w-72 shadow-lg ${blockInfo.colorClass} transition-all hover:shadow-md`}
    >
      {/* Handle'ы как у настоящих блоков */}
      {blockCategory !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Top}
          className={`w-3 h-3 ${blockInfo.handleColor} border-2 border-white`}
        />
      )}

      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-sm">
          <blockInfo.icon className="w-4 h-4" />
          <span className="flex-1 min-w-0">{blockInfo.categoryName}</span>
          <Badge>{blockInfo.name}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="text-xs font-medium mb-2">{blockInfo.name}</div>
        {/* Показываем конфигурацию как в настоящих блоках */}
        {renderBlockConfig(blockType, mockData.config)}
      </CardContent>

      {/* Выходной handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 ${blockInfo.handleColor} border-2 border-white`}
      />
    </Card>
  );
};
```

### 2. Handle компоненты в preview

- **Входной handle**: Показывается для всех блоков кроме trigger'ов
- **Выходной handle**: Показывается для всех блоков
- **Стилизация**: Цвета по категориям блоков
- **Позиционирование**: Position.Top и Position.Bottom

### 3. Цвета handle'ов по категориям

```tsx
const handleColors = {
  trigger: 'bg-green-500',
  context: 'bg-blue-500',
  logic: 'bg-yellow-500',
  action: 'bg-purple-500',
  wait: 'bg-orange-500',
};
```

### 4. Рендер конфигурации блоков

```tsx
const renderBlockConfig = (blockType: string, config: any) => {
  switch (blockType) {
    case 'board_move':
    case 'board_create':
      return (
        <>
          {config?.boardType && (
            <div className="text-xs text-muted-foreground mb-1">
              Board: {config.boardType.toUpperCase()}
            </div>
          )}
          {config?.targetColumn && (
            <div className="text-xs text-muted-foreground mb-1">
              Column: {config.targetColumn}
            </div>
          )}
          {config?.event && (
            <div className="text-xs text-muted-foreground">
              Event: {config.event.replace('_', ' ')}
            </div>
          )}
        </>
      );
    // ... другие типы блоков
  }
};
```

### 5. Мок данные для preview

```tsx
const getDefaultBlockConfig = (blockType: string) => {
  switch (blockType) {
    case 'board_move':
      return {
        boardType: 'jira',
        event: 'card_moved',
        targetColumn: 'In Progress',
      };
    case 'ai_request':
      return {
        aiModel: 'claude',
        prompt: 'Analyze the task',
      };
    // ... другие конфигурации
  }
};
```

## 🎨 Визуальные особенности

### Идентичность с канвас-блоками

- ✅ **Размер**: w-72 (точно как на канвасе)
- ✅ **Структура**: CardHeader + CardContent
- ✅ **Handle'ы**: Входные и выходные точки подключения
- ✅ **Цвета**: По категориям блоков
- ✅ **Контент**: Реальная конфигурация с деталями
- ✅ **Иконки**: Соответствующие типу блока
- ✅ **Badge**: С названием блока

### Информативность

- Показывает настройки блока (Board type, Model, Variables)
- Отображает события и параметры
- Truncate для длинных текстов
- Правильные названия блоков

## 🔧 Технические детали

### Импорты для Handle

```tsx
import { Handle, Position } from '@xyflow/react';
```

### React.createRoot для preview

- Создание DOM контейнера вне экрана
- Рендер полноценного React компонента
- Использование как drag image

### Обновленный getBlockInfo

```tsx
return {
  name: getBlockDisplayName(blockType),
  categoryName: categoryNames[blockCategory],
  colorClass: categoryColors[blockCategory],
  handleColor: handleColors[blockCategory], // ← Новое
  icon: blockIcons[blockType] || Zap,
  description: `Configure ${getBlockDisplayName(blockType)} settings`,
};
```

## 🚀 Результат

Теперь при перетаскивании блоков:

1. **Preview выглядит точно как финальный блок** на канвасе
2. **Показывает реальную информацию** о конфигурации
3. **Включает handle'ы** для подключений
4. **Имеет правильные размеры** и цвета
5. **Профессиональный UX** drag & drop

## 🎯 Пожелания пользователя - выполнены!

> "мне нужно чтобы с самого начала при перемещение блока на канвас было не белое окошко с напдписью, а вот пря полноценный блок"

✅ **Выполнено**: Теперь preview - это полноценный блок

> "доделай, чтобы он был полностью как блок на канвасе... чтобы и размер был тот же и информация внутри тоже"

✅ **Выполнено**: Размер w-72, вся информация, handle'ы, идентичная структура
