# 🔍 АУДИТ ПОЛЕЙ ДОКУМЕНТАЦИИ FLOW BUILDER

**Дата проверки:** 4 ноября 2025 г.  
**Проверяющий:** AI Agent  
**Цель:** Сверить поля в примерах документации с реальными полями в компонентах блоков

---

## ❌ КРИТИЧЕСКИЕ НЕСООТВЕТСТВИЯ (найдено на первом этапе):

### 1. MANUAL TRIGGER - ПОЛЯ ПОЛНОСТЬЮ НЕ СОВПАДАЮТ!

**📄 В документации (manual-trigger.md):**

- Trigger Name
- Description
- Input Parameters (массив объектов)
- Show Confirmation
- Available For

**💻 В коде (TriggerBlock.tsx):**

- `allowedUsers` (строка с пользователями через запятую)
- `requireConfirmation` (checkbox)

**❌ ВЫВОД:** Поля НЕ СОВПАДАЮТ! В документации описаны поля, которых НЕТ В КОДЕ!

---

### 2. EVENT LISTENER - ОТСУТСТВУЕТ EVENT SOURCE

**📄 В документации (event-listener.md):**

- Event Type ✓
- Event Filter ✓
- Debounce Time (?)

**💻 В коде (TriggerBlock.tsx):**

- `eventSource` (select: board/user/system/custom) ← **ОТСУТСТВУЕТ в примерах!**
- `eventType` ✓
- `eventFilters.boardType` (для board events)

**❌ ВЫВОД:** В примерах НЕТ поля Event Source, которое есть в коде!

---

### 3. WEBHOOK - Headers to Extract НЕТ В КОДЕ

**📄 В документации (webhook.md):**

- HTTP Метод ✓
- Webhook URL ✓
- Webhook Secret ✓
- **Headers to Extract** ← **НЕ СУЩЕСТВУЕТ в коде!**

**💻 В коде (TriggerBlock.tsx):**

- `webhookMethod` ✓
- `webhookUrl` ✓
- `webhookSecret` ✓

**❌ ВЫВОД:** Поле "Headers to Extract" описано в документации, но отсутствует в коде!

---

### 4. SCHEDULE - ВСЁ СОВПАДАЕТ ✅

**📄 В документации (schedule.md):**

- Тип расписания ✓
- Cron выражение ✓
- Временная зона ✓

**💻 В коде (TriggerBlock.tsx):**

- `schedule.type` (cron/interval/once) ✓
- `schedule.expression` ✓
- `schedule.timezone` ✓

**✅ ВЫВОД:** Полностью совпадает!

---

## 📊 СТАТИСТИКА (ПЕРВЫЙ ЭТАП):

- ✅ **Правильно:** 1 блок (Schedule)
- ⚠️ **Частично:** 1 блок (Webhook - основные поля есть, но лишнее Headers)
- ❌ **Несовпадения:** 2 блока (Manual Trigger, Event Listener)
- 🔍 **Не проверено:** ~20 блоков

---

## 🔍 ВТОРОЙ ЭТАП ПРОВЕРКИ (в процессе):

### CONTEXT БЛОКИ:

#### 5. TRANSFORM DATA

**Статус:** Проверяется...

#### 6. EXTRACT TEXT

**Статус:** Проверяется...

#### 7. EXTRACT FILES

**Статус:** Проверяется...

#### 8. EXTRACT MEDIA

**Статус:** Проверяется...

#### 9. GET DATA

**Статус:** Проверяется...

#### 10. RAG PROCESSING

**Статус:** Проверяется...

---

### ACTION БЛОКИ:

#### 11. AI REQUEST

**Статус:** Проверяется...

#### 12. COMMENT

**Статус:** Проверяется...

#### 13. SEND MESSAGE

**Статус:** Проверяется...

#### 14. API CALL

**Статус:** Проверяется...

#### 15. GENERATE FILE

**Статус:** Проверяется...

#### 16. MCP OPERATION

**Статус:** Проверяется...

#### 17. STORE DATA

**Статус:** Проверяется...

---

### LOGIC БЛОКИ:

#### 18. IF-ELSE

**Статус:** Проверяется...

#### 19. SWITCH

**Статус:** Проверяется...

#### 20. LOOP

**Статус:** Проверяется...

---

### WAIT БЛОКИ:

#### 21. WAIT RESPONSE

**Статус:** Проверяется...

#### 22. WAIT TIMEOUT

**Статус:** Проверяется...

#### 23. WAIT CONDITION

**Статус:** Проверяется...

---

## 🎯 ПЛАН ДЕЙСТВИЙ:

1. ✅ Сохранить отчёт
2. 🔄 Проверить все остальные блоки (Context, Actions, Logic, Wait)
3. 📝 Обсудить найденные несоответствия
4. 🔧 Исправить документацию согласно реальным полям

---

## 📝 ПРИМЕЧАНИЯ:

- Проверка проводится путём сравнения полей в компонентах (.tsx файлы) с примерами в документации (.md файлы)
- Фокус на разделе "Примеры использования" в каждом файле документации
- Приоритет - соответствие реальным полям в коде

---

## 🔍 ДЕТАЛЬНАЯ ПРОВЕРКА ВСЕХ БЛОКОВ:

### ✅ CONTEXT БЛОКИ (проверено):

#### 5. TRANSFORM DATA ✅

**Поля в коде (ContextBlock.tsx):**

- variableName ✓
- source ✓
- transformationType (select: javascript/map/filter/reduce/sort/groupBy/format) ✓
- transformationCode (для javascript/map/reduce) ✓
- filterCondition (для filter) ✓
- sortField + sortOrder (для sort) ✓
- groupByField (для groupBy) ✓
- outputFormat (для format) ✓

**Проверка документации:** Поля СОВПАДАЮТ ✅

---

#### 6. EXTRACT TEXT ✅

**Поля в коде (ContextBlock.tsx):**

- variableName ✓
- source ✓

**Проверка документации:** Нужно проверить детальнее...

---

#### 7. EXTRACT FILES ✅

**Поля в коде (ContextBlock.tsx):**

- variableName ✓
- source ✓
- filter.fileType (типы файлов через запятую) ✓

**Проверка документации:** Нужно проверить примеры...

---

#### 8. EXTRACT MEDIA

**Поля в коде (ContextBlock.tsx):**

- variableName ✓
- source ✓

**Проверка документации:** Проверяется...

---

#### 9. GET DATA

**Поля в коде (ContextBlock.tsx):**

- variableName ✓
- source ✓

**Проверка документации:** Проверяется...

---

#### 10. RAG PROCESSING

**Поля в коде (ContextBlock.tsx):**

- variableName ✓
- source ✓

**Проверка документации:** Проверяется...

---

### ✅ ACTION БЛОКИ (проверено частично):

#### 11. AI REQUEST ✅

**Поля в коде (ActionBlock.tsx):**

- aiModel (select: gpt-4, gpt-3.5-turbo, claude-3, gemini-pro) ✓
- prompt (textarea) ✓
- responseVariable ✓

**⚠️ В документации могут быть дополнительные поля:**

- System Prompt
- Temperature
- Max Tokens
- Response Format
- JSON Schema

**Нужно проверить:** Есть ли эти поля в коде?

---

#### 12. COMMENT ✅

**Поля в коде (ActionBlock.tsx):**

- commentText ✓

**Проверка документации:** Проверяется...

---

#### 13. SEND MESSAGE

**Поля в коде (ActionBlock.tsx):**
Проверяется...

---

#### 14. API CALL ✅

**Поля в коде (ActionBlock.tsx):**

- url ✓
- method (GET/POST/PUT/DELETE/PATCH) ✓
- headers (textarea, JSON) ✓

**Нужно проверить документацию на:**

- Body
- Query Parameters
- Authentication
- Timeout
- Retry Settings

---

#### 15. GENERATE FILE ✅

**Поля в коде (ActionBlock.tsx):**

- fileName ✓
- fileFormat (txt/json/csv/pdf/doc) ✓
- content ✓

**Проверка документации:** Проверяется...

---

## ❌ НОВЫЕ НЕСООТВЕТСТВИЯ НАЙДЕНЫ:

### 🔴 AI REQUEST - МНОГО ПОЛЕЙ ОТСУТСТВУЕТ В КОДЕ!

**📄 В документации (ai-request.md) используются поля:**

- AI Модель ✓ (есть в коде)
- System Prompt ❌ НЕТ В КОДЕ!
- Промпт ✓ (есть в коде как prompt)
- Temperature ❌ НЕТ В КОДЕ!
- Max Tokens ❌ НЕТ В КОДЕ!
- Response Format ❌ НЕТ В КОДЕ!
- JSON Schema ❌ НЕТ В КОДЕ!
- Выполнять асинхронно ❌ НЕТ В КОДЕ!
- Сохранить результат в переменную ✓ (есть как responseVariable)

**💻 В коде (ActionBlock.tsx) РЕАЛЬНО есть только:**

- aiModel (select)
- prompt (textarea)
- responseVariable (input)

**❌ КРИТИЧНО:** В документации описано 8+ полей, а в коде только 3!

---
