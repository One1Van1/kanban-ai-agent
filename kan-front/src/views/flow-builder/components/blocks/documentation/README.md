# 📚 Документация блоков Flow Builder

## Триггеры (Triggers)

Запускают поток выполнения

- [Webhook](./triggers/webhook.md) - Входящий HTTP запрос
- [Schedule](./triggers/schedule.md) - По расписанию (cron)
- [Event Listener](./triggers/event-listener.md) - При событии в системе
- [Manual Trigger](./triggers/manual-trigger.md) - Ручной запуск

## Контекст (Context)

Получают и обрабатывают данные

- [Extract Files](./context/extract-files.md) - Извлечь файлы из источников
- [Extract Text](./context/extract-text.md) - Извлечь текст из файлов (OCR)
- [Extract Media](./context/extract-media.md) - Извлечь медиа из файлов
- [Get Data](./context/get-data.md) - Получить данные из любого источника
- [RAG Processing](./context/rag-processing.md) - RAG обработка текста
- [Transform Data](./context/transform-data.md) - Преобразовать данные

## Логика (Logic)

Управляют потоком выполнения

- [If/Else](./logic/if-else.md) - Условное ветвление
- [Switch](./logic/switch.md) - Множественный выбор
- [Loop](./logic/loop.md) - Цикл по коллекции

## Действия (Actions)

Выполняют операции

- [Comment](./actions/comment.md) - Добавить комментарий
- [AI Request](./actions/ai-request.md) - Запрос к AI модели
- [Generate File](./actions/generate-file.md) - Сгенерировать файл
- [Send Message](./actions/send-message.md) - Отправить сообщение
- [API Call](./actions/api-call.md) - HTTP запрос к внешнему API
- [MCP Operation](./actions/mcp-operation.md) - Model Context Protocol операция
- [Store Data](./actions/store-data.md) - Сохранить данные в хранилище

## Ожидание (Wait)

Управление временем выполнения

- [Wait Response](./wait/wait-response.md) - Ожидать ответ от пользователя
- [Wait Timeout](./wait/wait-timeout.md) - Пауза на заданное время
- [Wait Condition](./wait/wait-condition.md) - Ждать выполнения условия
