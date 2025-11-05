# 📋 План исправления документации Flow Builder

**Стратегия:** Вариант 1 - Упростить документацию под существующий код
**Дата:** 04.11.2025
**Оценка времени:** 2-3 часа

---

## 🎯 Цель

Привести всю документацию в соответствие с реальной реализацией блоков в коде.
Удалить поля, которых нет в коде. Добавить поля, которые есть в коде, но отсутствуют в документации.

---

## 🔴 КРИТИЧНЫЕ ИСПРАВЛЕНИЯ (требуют полной переработки примеров)

### 1. ❌ Manual Trigger (manual-trigger.md)

**Текущее состояние в docs:**
- Trigger Name
- Description  
- Input Parameters (массив с type, name, required)
- Show Confirmation
- Available For

**Реальные поля в коде:**
- `allowedUsers` (input, строка через запятую)
- `requireConfirmation` (checkbox)

**Действия:**
- ✏️ Переписать раздел "Поля блока" - показать только 2 поля
- ✏️ Обновить ВСЕ примеры использования (удалить Input Parameters, добавить allowedUsers)
- ✏️ Упростить описание - это простой триггер без сложных параметров

---

### 2. ❌ AI Request (ai-request.md) - САМЫЙ БОЛЬШОЙ ОБЪЁМ РАБОТЫ

**Удалить из документации:**
- ❌ System Prompt (системное сообщение)
- ❌ Temperature (0-1, креативность)
- ❌ Max Tokens (лимит токенов)
- ❌ Response Format (text/json/structured)
- ❌ JSON Schema (схема для structured)
- ❌ Выполнять асинхронно (флаг)

**Оставить только:**
- ✅ AI Модель (select: gpt-4, gpt-3.5-turbo, claude-3, gemini-pro)
- ✅ Промпт (textarea)
- ✅ Сохранить результат в переменную (input)

**Действия:**
- ✏️ Переписать раздел "Поля блока"
- ✏️ Обновить раздел "Примеры использования" (минимум 5-10 примеров)
- ✏️ Упростить описание настроек
- ⚠️ Добавить примечание: "Продвинутые настройки AI (Temperature, System Prompt) планируются в следующих версиях"

---

### 3. ❌ API Call (api-call.md)

**Удалить из документации:**
- ❌ Timeout (число секунд)
- ❌ Max Retries (количество попыток)
- ❌ Retry Delay (секунды между попытками)
- ❌ Authentication (тип аутентификации)
- ❌ Query Parameters (как отдельное поле - можно упомянуть в URL)

**Оставить только:**
- ✅ URL (input)
- ✅ HTTP Method (select: GET, POST, PUT, DELETE, PATCH)
- ✅ Headers (textarea, JSON)
- ✅ Body (textarea, JSON)
- ✅ Сохранить результат в переменную (input)

**Действия:**
- ✏️ Переписать раздел "Поля блока"
- ✏️ Обновить примеры (убрать Timeout, Retries, Auth из всех примеров)
- ✏️ Добавить примечание: "Query parameters включаются прямо в URL: `https://api.example.com?page=1&limit=10`"
- ⚠️ Добавить: "Retry logic и Authentication планируются в будущих версиях"

---

## 🟡 ПРОСТЫЕ ИСПРАВЛЕНИЯ (добавить/удалить одно поле)

### 4. ⚠️ Event Listener (event-listener.md)

**Добавить поле:**
- ✅ Event Source (select: board, user, system, custom)

**Действия:**
- ✏️ Добавить поле в раздел "Поля блока"
- ✏️ Добавить Event Source во все примеры (значение: "board" по умолчанию)
- ✏️ Описать значения: board (события досок), user (события пользователей), system (системные события), custom (кастомные события)

---

### 5. ⚠️ Webhook (webhook.md)

**Удалить поле:**
- ❌ Headers to Extract (массив заголовков)

**Действия:**
- ✏️ Удалить из раздела "Поля блока"
- ✏️ Убрать из всех примеров

---

## ✅ ПРОВЕРКА СООТВЕТСТВИЯ (быстрая проверка примеров)

### 6. Schedule (schedule.md)

**Ожидаемые поля:**
- schedule.type (select: cron, interval, specific_time)
- schedule.expression (input)
- schedule.timezone (input)

**Действия:**
- 👀 Прочитать примеры, убедиться что поля совпадают
- ✏️ Если нет - привести в соответствие

---

### 7. Transform Data (transform-data.md)

**Ожидаемые поля:**
- variableName, source (общие)
- transformationType (select: filter, map, sort, group, reduce, aggregate, custom)
- transformationCode, filterCondition, sortField, sortOrder, groupByField, outputFormat

**Действия:**
- 👀 Проверить примеры на соответствие
- ✏️ Убедиться что все 7 типов трансформации описаны

---

### 8-12. Context блоки (5 файлов)

**Файлы:** extract-text.md, extract-files.md, extract-media.md, get-data.md, rag-processing.md

**Ожидаемые поля:**
- Все: variableName, source
- Extract Files: дополнительно filter.fileType

**Действия:**
- 👀 Быстрая проверка примеров (по 1 примеру на файл)

---

### 13-15. Action блоки (3 файла)

**comment.md:**
- cardId (input)
- commentText (textarea)

**generate-file.md:**
- fileName (input)
- fileFormat (select: txt, json, csv, pdf, doc)
- content (textarea)

**send-message.md:**
- channel (select: telegram, email, slack, discord, whatsapp, sms, webhook)
- recipient (input)
- message (textarea)

**Действия:**
- 👀 Проверить примеры

---

### 16-17. MCP и Store Data

**mcp-operation.md:**
- mcpServer (select: filesystem, database, api, ai-tools)
- operation (select: read, write, execute, query)
- params (textarea, JSON)

**store-data.md:**
- storageKey (input)
- storageValue (textarea)

**Действия:**
- 👀 Проверить примеры

---

### 18-20. Logic блоки (3 файла)

**if-else.md:**
- condition.variable (input)
- condition.operator (select: equals, not_equals, greater, less, contains)
- condition.value (input)

**loop.md:**
- collection (input - массив)
- itemVariable (input - имя переменной)
- maxIterations (number)

**switch.md:**
- ⚠️ НЕТ ПОЛЕЙ КОНФИГУРАЦИИ (просто переключатель)

**Действия:**
- 👀 Проверить примеры
- ✏️ Switch - убрать любые поля конфигурации, если есть

---

### 21-23. Wait блоки (3 файла)

**wait-timeout.md:**
- duration (number)
- unit (select: seconds, minutes, hours)

**wait-response.md:**
- responseVariable (input)
- timeout (number, default: 30)
- condition (select: not_empty, equals, contains, api_success)
- + VariableStorageControl компонент

**wait-condition.md:**
- responseVariable (input)
- timeout (number)
- condition (select: not_empty, equals, contains, api_success)

**Действия:**
- 👀 Проверить примеры

---

## 📊 Итоговая проверка

### 24. Обновить DOCUMENTATION_FIELDS_AUDIT.md

**Добавить секцию:**
```markdown
## ✅ ИСПРАВЛЕНИЯ ЗАВЕРШЕНЫ

**Дата завершения:** 04.11.2025
**Стратегия:** Вариант 1 - Упростить документацию

### Изменённые файлы:

**Критичные исправления (полная переработка):**
- ✅ manual-trigger.md - переписаны все примеры
- ✅ ai-request.md - удалены 6 продвинутых полей
- ✅ api-call.md - удалены retry/auth поля

**Простые исправления:**
- ✅ event-listener.md - добавлено поле Event Source
- ✅ webhook.md - удалено поле Headers to Extract

**Проверка соответствия:**
- ✅ schedule.md
- ✅ transform-data.md
- ✅ extract-text.md, extract-files.md, extract-media.md, get-data.md, rag-processing.md
- ✅ comment.md, generate-file.md, send-message.md
- ✅ mcp-operation.md, store-data.md
- ✅ if-else.md, loop.md, switch.md
- ✅ wait-timeout.md, wait-response.md, wait-condition.md

**Всего файлов:** 23
**Статус:** ✅ Документация соответствует коду на 100%
```

---

## 🚀 Порядок выполнения

1. **Критичные (1-3)** → самые большие изменения, начать с них
2. **Простые (4-5)** → быстрые правки
3. **Проверка (6-23)** → пакетная проверка всех остальных
4. **Финал (24)** → обновить аудит

**Оценка времени:**
- Критичные: 90 минут (по 30 мин на каждый)
- Простые: 20 минут
- Проверка: 40 минут (по 2 мин на файл)
- Итого: ~2.5 часа

---

**Готов к исполнению!** 🎯
