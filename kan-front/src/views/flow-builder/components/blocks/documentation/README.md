# 📚 Документация блоков Flow Builder

## Триггеры (Triggers)

Запускают поток выполнения

- [Webhook](./triggers/webhook.md) - Входящий HTTP запрос
- [Schedule](./triggers/schedule.md) - По расписанию (cron)
- [Event Listener](./triggers/event-listener.md) - При событии в системе
- [Manual Trigger](./triggers/manual-trigger.md) - Ручной запуск

## Контекст (Context)

Получают данные для работы

- [Board Data](./context/board-data.md) - Данные досок
- [User Data](./context/user-data.md) - Данные пользователей
- [Task Data](./context/task-data.md) - Данные задач
- [Extract Text](./context/extract-text.md) - Извлечь текст из файлов
- [Extract Media](./context/extract-media.md) - Извлечь медиа из файлов
- [Get Data](./context/get-data.md) - Получить данные из БД/API
- [RAG Processing](./context/rag-processing.md) - RAG обработка текста
- [Transform Data](./context/transform-data.md) - Преобразовать данные

## Логика (Logic)

Управляют потоком выполнения

- [Condition](./logic/condition.md) - Условие (if/else)
- [Loop](./logic/loop.md) - Цикл (for/while)
- [Try/Catch](./logic/try-catch.md) - Обработка ошибок
- [Switch](./logic/switch.md) - Множественный выбор
- [Parallel](./logic/parallel.md) - Параллельное выполнение

## Действия (Actions)

Выполняют операции

- [AI Request](./actions/ai-request.md) - Запрос к AI
- [Create Task](./actions/create-task.md) - Создать задачу
- [Update Task](./actions/update-task.md) - Обновить задачу
- [Generate File](./actions/generate-file.md) - Создать файл
- [Send Message](./actions/send-message.md) - Отправить сообщение
- [API Call](./actions/api-call.md) - HTTP запрос к API
- [MCP Operation](./actions/mcp-operation.md) - MCP операция

## Ожидание (Wait)

Паузы и сохранение

- [Delay](./wait/delay.md) - Пауза на время
- [Wait for Event](./wait/wait-for-event.md) - Ждать события
- [Store Data](./wait/store-data.md) - Сохранить данные
