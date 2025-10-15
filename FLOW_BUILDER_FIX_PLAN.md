# 🔧 План исправления совместимости Flow Builder

## 🎯 **Цель**: Сделать Flow Builder полностью совместимым между фронтом и бэком

---

## 📋 **Три ключевые задачи**

### 1. ✅ **Flow Builder → Backend сохранение**

**Статус**: Частично работает

- Endpoint `POST /ai-agent/flow-builder/save-flow` принимает данные
- Проблема: неполная обработка типов блоков

### 2. ❌ **Backend понимание всех блоков**

**Статус**: Главная проблема

- Сейчас бэк понимает только 3 типа из 15+
- Нужно расширить обработку всех типов

### 3. ⚠️ **Правильная конвертация Flow → Agent**

**Статус**: Нужна доработка

- Базовая конвертация работает
- Нужно учитывать последовательность и связи блоков

---

## 🚀 **План реализации**

### **Этап 1: Исправить Backend понимание блоков** 🔥 _Высокий приоритет_

**Файл**: `/kan-back/src/features/ai-agent/create-agent/create-agent.controller.ts`

**Что делать**:

```typescript
// Расширить switch в методе generateAgentInstructions()
// Добавить поддержку всех типов блоков с фронта:

// Action блоки:
case 'api_call':          // HTTP запросы к внешним API
case 'create_file':       // Создание и прикрепление файлов
case 'attach_file':       // Работа с файлами
case 'send_notification': // Отправка уведомлений
case 'move_card':         // Перемещение карточек
case 'update_field':      // Обновление полей задач

// Wait блоки:
case 'wait_response':     // Ожидание ответа
case 'wait_timeout':      // Ожидание по времени
case 'wait_condition':    // Ожидание условия

// Logic блоки:
case 'if_condition':      // Условные переходы
case 'switch_condition':  // Множественный выбор
```

**Результат**: Бэк будет понимать все блоки, которые создает фронт

---

### **Этап 2: Исправить формат ответа API** 🔥 _Высокий приоритет_

**Файл**: `/kan-back/src/features/ai-agent/create-agent/create-agent.controller.ts`

**Что делать**:

```typescript
// В методе saveFlow() исправить return:
return {
  success: true,
  message: `Flow "${flowDefinition?.name}" saved successfully`,
  flowId: flowDefinition?.id || crypto.randomUUID(), // Правильный ID
  flow: flowDefinition, // Вернуть сохраненный flow
  agent: {
    // Информация о созданном агенте
    id: agent.id,
    name: agent.name,
  },
  instructions: instructions, // Созданные инструкции
};
```

**Результат**: Фронт получит ожидаемую структуру данных

---

### **Этап 3: Улучшить конвертацию Flow → Agent** 🟡 _Средний приоритет_

**Файлы**:

- `/kan-back/src/features/ai-agent/create-agent/create-agent.controller.ts`
- Возможно новый helper: `/kan-back/src/shared/flow-converter/`

**Что делать**:

1. **Учитывать последовательность блоков**:

   ```typescript
   // Не просто перечислять блоки, а следовать их порядку
   const orderedBlocks = sortBlocksByFlow(
     flowDefinition.blocks,
     flowDefinition.edges,
   );
   ```

2. **Использовать конфигурацию блоков**:

   ```typescript
   // Для каждого блока учитывать его config
   case 'ai_request':
     const prompt = block.config?.prompt || 'Default prompt';
     instructions.push(`- Выполни AI анализ: "${prompt}"`);
   ```

3. **Обрабатывать условные переходы**:
   ```typescript
   case 'if_condition':
     const condition = block.config?.condition;
     instructions.push(`- Если ${condition}, то перейди к следующему шагу`);
   ```

**Результат**: Agent получит более точные и полезные инструкции

---

### **Этап 4: Добавить Flow Management** 🟢 _Низкий приоритет_

**Новый блок**: `/kan-back/src/features/flow-management/`

**Endpoints для создания**:

```typescript
POST   /flow-management/flows              // Создание flow
GET    /flow-management/flows/:id          // Получение flow
PUT    /flow-management/flows/:id          // Обновление flow
DELETE /flow-management/flows/:id          // Удаление flow
GET    /flow-management/flows              // Список flows
```

**Что это даст**:

- Flows как отдельные сущности (не только конвертация в агентов)
- Возможность редактировать сохраненные flows
- Proper flow persistence в базе данных

---

## ⏰ **Временные рамки**

### **Фаза 1: Критические исправления** (1-2 дня)

- ✅ Этап 1: Расширить понимание блоков
- ✅ Этап 2: Исправить API response

### **Фаза 2: Улучшения** (3-5 дней)

- ✅ Этап 3: Улучшить конвертацию Flow → Agent

### **Фаза 3: Расширенные возможности** (1-2 недели)

- ✅ Этап 4: Flow Management API

---

## 🧪 **Тестирование**

После каждого этапа тестировать:

1. **Создание Flow на фронте** → должно работать без ошибок
2. **Сохранение Flow** → должно успешно отправляться на бэк
3. **Конвертация в Agent** → должна создавать правильные инструкции
4. **Проверка Agent'а** → должен выполнять задачи согласно Flow

---

## 📝 **Итог**

После выполнения **Фазы 1** (1-2 дня) Flow Builder будет работать на **95%**.

После **Фазы 2** будет полная совместимость и качественная конвертация.

**Фаза 3** добавит расширенные возможности управления flows.

---

**Начинаем с Этапа 1** - это даст максимальный эффект за минимальное время! 🚀
