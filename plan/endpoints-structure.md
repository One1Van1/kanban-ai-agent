# 📋 План реализации эндпойнтов по HTTP-методам

## 🏗️ Архитектурный принцип разделения

Каждый блок функций разделяется по HTTP-методам для лучшей организации и понимания API:

```
feature-block/
├── GET/        # Получение данных (чтение)
├── POST/       # Создание новых ресурсов
├── PUT/        # Полное обновление ресурсов
├── PATCH/      # Частичное обновление ресурсов
└── DELETE/     # Удаление ресурсов
```

---

## 🔥 KANBAN-MANAGEMENT ENDPOINTS

### 📥 GET Endpoints (Получение данных)

#### GET /kanban/tasks/:id

```
Папка: src/features/kanban-management/GET/get-task-details/
Описание: Получить детальную информацию о задаче
Параметры: taskId (string)
Ответ: TaskDetailsDto
Приоритет: 🔥 Критический
```

#### GET /kanban/columns/:column/tasks

```
Папка: src/features/kanban-management/GET/get-tasks-by-column/
Описание: Получить все задачи в определенной колонке
Параметры: columnName (string), limit?, offset?
Ответ: TaskListDto
Приоритет: 🔥 Критический
```

#### GET /kanban/boards/:id/structure

```
Папка: src/features/kanban-management/GET/get-board-structure/
Описание: Получить структуру доски (колонки, правила, настройки)
Параметры: boardId (string)
Ответ: BoardStructureDto
Приоритет: 🔥 Критический
```

#### GET /kanban/tasks/:id/history

```
Папка: src/features/kanban-management/GET/get-task-history/
Описание: Получить историю изменений задачи
Параметры: taskId (string)
Ответ: TaskHistoryDto[]
Приоритет: 📊 Высокий
```

#### GET /kanban/tasks/:id/comments

```
Папка: src/features/kanban-management/GET/get-task-comments/
Описание: Получить все комментарии к задаче
Параметры: taskId (string)
Ответ: TaskCommentsDto
Приоритет: 📊 Высокий
```

#### GET /kanban/users/:id/tasks

```
Папка: src/features/kanban-management/GET/get-assignee-tasks/
Описание: Получить все задачи назначенные пользователю
Параметры: userId (string), status?, limit?
Ответ: UserTasksDto
Приоритет: 📊 Высокий
```

#### GET /kanban/boards/:id/stats

```
Папка: src/features/kanban-management/GET/get-board-statistics/
Описание: Получить статистику по доске
Параметры: boardId (string), dateFrom?, dateTo?
Ответ: BoardStatisticsDto
Приоритет: 🎯 Средний
```

#### GET /kanban/projects/:id/overview

```
Папка: src/features/kanban-management/GET/get-project-overview/
Описание: Получить обзор проекта
Параметры: projectId (string)
Ответ: ProjectOverviewDto
Приоритет: 🎯 Средний
```

---

### ➕ POST Endpoints (Создание данных)

#### POST /kanban/tasks

```
Папка: src/features/kanban-management/POST/create-task/
Описание: Создать новую задачу
Тело запроса: CreateTaskDto
Ответ: CreatedTaskDto
Приоритет: 🔥 Критический
```

#### POST /kanban/boards

```
Папка: src/features/kanban-management/POST/create-board/
Описание: Создать новую доску
Тело запроса: CreateBoardDto
Ответ: CreatedBoardDto
Приоритет: 📊 Высокий
```

#### POST /kanban/columns

```
Папка: src/features/kanban-management/POST/create-column/
Описание: Создать новую колонку в доске
Тело запроса: CreateColumnDto
Ответ: CreatedColumnDto
Приоритет: 📊 Высокий
```

#### POST /kanban/tasks/:id/comments

```
Папка: src/features/kanban-management/POST/add-task-comment/
Описание: Добавить комментарий к задаче
Параметры: taskId (string)
Тело запроса: AddCommentDto
Ответ: CommentCreatedDto
Приоритет: 🔥 Критический
```

#### POST /kanban/tasks/:id/assign

```
Папка: src/features/kanban-management/POST/assign-task/
Описание: Назначить задачу пользователю
Параметры: taskId (string)
Тело запроса: AssignTaskDto
Ответ: TaskAssignedDto
Приоритет: 🔥 Критический
```

#### POST /kanban/projects

```
Папка: src/features/kanban-management/POST/create-project/
Описание: Создать новый проект
Тело запроса: CreateProjectDto
Ответ: CreatedProjectDto
Приоритет: 🎯 Средний
```

#### POST /kanban/tasks/:id/attachments

```
Папка: src/features/kanban-management/POST/add-task-attachment/
Описание: Добавить файл к задаче
Параметры: taskId (string)
Тело запроса: multipart/form-data
Ответ: AttachmentAddedDto
Приоритет: 🎯 Средний
```

#### POST /kanban/tasks/:id/labels

```
Папка: src/features/kanban-management/POST/create-task-label/
Описание: Добавить метку к задаче
Параметры: taskId (string)
Тело запроса: CreateLabelDto
Ответ: LabelCreatedDto
Приоритет: 🎯 Средний
```

---

### 🔄 PUT Endpoints (Полное обновление)

#### PUT /kanban/tasks/:id

```
Папка: src/features/kanban-management/PUT/update-task/
Описание: Полностью обновить задачу
Параметры: taskId (string)
Тело запроса: UpdateTaskDto
Ответ: UpdatedTaskDto
Приоритет: 🔥 Критический
```

#### PUT /kanban/boards/:id

```
Папка: src/features/kanban-management/PUT/update-board/
Описание: Полностью обновить доску
Параметры: boardId (string)
Тело запроса: UpdateBoardDto
Ответ: UpdatedBoardDto
Приоритет: 📊 Высокий
```

#### PUT /kanban/columns/:id

```
Папка: src/features/kanban-management/PUT/update-column/
Описание: Полностью обновить колонку
Параметры: columnId (string)
Тело запроса: UpdateColumnDto
Ответ: UpdatedColumnDto
Приоритет: 📊 Высокий
```

#### PUT /kanban/projects/:id

```
Папка: src/features/kanban-management/PUT/update-project/
Описание: Полностью обновить проект
Параметры: projectId (string)
Тело запроса: UpdateProjectDto
Ответ: UpdatedProjectDto
Приоритет: 🎯 Средний
```

#### PUT /kanban/tasks/:id/priority

```
Папка: src/features/kanban-management/PUT/update-task-priority/
Описание: Обновить приоритет задачи
Параметры: taskId (string)
Тело запроса: UpdatePriorityDto
Ответ: PriorityUpdatedDto
Приоритет: 📊 Высокий
```

---

### 🔧 PATCH Endpoints (Частичное обновление)

#### PATCH /kanban/tasks/:id/move

```
Папка: src/features/kanban-management/PATCH/move-task-to-column/
Описание: Переместить задачу в другую колонку
Параметры: taskId (string)
Тело запроса: MoveTaskDto
Ответ: TaskMovedDto
Приоритет: 🔥 Критический
```

#### PATCH /kanban/tasks/:id/status

```
Папка: src/features/kanban-management/PATCH/change-task-status/
Описание: Изменить статус задачи
Параметры: taskId (string)
Тело запроса: ChangeStatusDto
Ответ: StatusChangedDto
Приоритет: 🔥 Критический
```

#### PATCH /kanban/tasks/:id/assignee

```
Папка: src/features/kanban-management/PATCH/update-task-assignee/
Описание: Изменить исполнителя задачи
Параметры: taskId (string)
Тело запроса: UpdateAssigneeDto
Ответ: AssigneeUpdatedDto
Приоритет: 🔥 Критический
```

#### PATCH /kanban/tasks/:id/priority

```
Папка: src/features/kanban-management/PATCH/change-task-priority/
Описание: Изменить приоритет задачи
Параметры: taskId (string)
Тело запроса: ChangePriorityDto
Ответ: PriorityChangedDto
Приоритет: 📊 Высокий
```

#### PATCH /kanban/tasks/:id/due-date

```
Папка: src/features/kanban-management/PATCH/update-task-due-date/
Описание: Обновить срок выполнения задачи
Параметры: taskId (string)
Тело запроса: UpdateDueDateDto
Ответ: DueDateUpdatedDto
Приоритет: 📊 Высокий
```

#### PATCH /kanban/tasks/:id/flag

```
Папка: src/features/kanban-management/PATCH/toggle-task-flag/
Описание: Установить/снять флаг важности
Параметры: taskId (string)
Тело запроса: ToggleFlagDto
Ответ: FlagToggledDto
Приоритет: 🎯 Средний
```

---

### 🗑️ DELETE Endpoints (Удаление)

#### DELETE /kanban/tasks/:id

```
Папка: src/features/kanban-management/DELETE/delete-task/
Описание: Удалить задачу
Параметры: taskId (string)
Ответ: TaskDeletedDto
Приоритет: 📊 Высокий
```

#### DELETE /kanban/boards/:id

```
Папка: src/features/kanban-management/DELETE/delete-board/
Описание: Удалить доску
Параметры: boardId (string)
Ответ: BoardDeletedDto
Приоритет: 🎯 Средний
```

#### DELETE /kanban/columns/:id

```
Папка: src/features/kanban-management/DELETE/delete-column/
Описание: Удалить колонку
Параметры: columnId (string)
Ответ: ColumnDeletedDto
Приоритет: 🎯 Средний
```

#### DELETE /kanban/tasks/:id/comments/:commentId

```
Папка: src/features/kanban-management/DELETE/remove-task-comment/
Описание: Удалить комментарий
Параметры: taskId (string), commentId (string)
Ответ: CommentRemovedDto
Приоритет: 🎯 Средний
```

#### DELETE /kanban/tasks/:id/attachments/:attachmentId

```
Папка: src/features/kanban-management/DELETE/remove-task-attachment/
Описание: Удалить вложение
Параметры: taskId (string), attachmentId (string)
Ответ: AttachmentRemovedDto
Приоритет: 🎯 Средний
```

#### DELETE /kanban/projects/:id

```
Папка: src/features/kanban-management/DELETE/delete-project/
Описание: Удалить проект
Параметры: projectId (string)
Ответ: ProjectDeletedDto
Приоритет: 🎯 Средний
```

---

## 📊 TASK-ANALYTICS ENDPOINTS

### 📥 GET Endpoints

#### GET /analytics/productivity

```
Папка: src/features/task-analytics/GET/get-productivity-metrics/
Описание: Получить метрики продуктивности
Параметры: dateFrom?, dateTo?, teamId?
Ответ: ProductivityMetricsDto
Приоритет: 📊 Высокий
```

#### GET /analytics/team/:id/performance

```
Папка: src/features/task-analytics/GET/get-team-performance/
Описание: Анализ производительности команды
Параметры: teamId (string), period?
Ответ: TeamPerformanceDto
Приоритет: 📊 Высокий
```

#### GET /analytics/projects/:id/burndown

```
Папка: src/features/task-analytics/GET/get-burndown-chart/
Описание: Данные для burndown chart
Параметры: projectId (string)
Ответ: BurndownDataDto
Приоритет: 📊 Высокий
```

#### GET /analytics/cycle-time

```
Папка: src/features/task-analytics/GET/get-cycle-time-analysis/
Описание: Анализ времени выполнения задач
Параметры: boardId?, dateFrom?, dateTo?
Ответ: CycleTimeAnalysisDto
Приоритет: 🎯 Средний
```

#### GET /analytics/bottlenecks

```
Папка: src/features/task-analytics/GET/get-bottleneck-analysis/
Описание: Анализ узких мест в процессе
Параметры: boardId?, period?
Ответ: BottleneckAnalysisDto
Приоритет: 🎯 Средний
```

#### GET /analytics/completion-rates

```
Папка: src/features/task-analytics/GET/get-task-completion-rate/
Описание: Показатели завершения задач
Параметры: period?, teamId?
Ответ: CompletionRateDto
Приоритет: 🎯 Средний
```

### ➕ POST Endpoints

#### POST /analytics/reports/custom

```
Папка: src/features/task-analytics/POST/generate-custom-report/
Описание: Создать кастомный отчет
Тело запроса: CustomReportDto
Ответ: GeneratedReportDto
Приоритет: 🎯 Средний
```

#### POST /analytics/alerts

```
Папка: src/features/task-analytics/POST/create-analytics-alert/
Описание: Создать уведомление по метрикам
Тело запроса: CreateAlertDto
Ответ: AlertCreatedDto
Приоритет: 🎯 Средний
```

#### POST /analytics/export

```
Папка: src/features/task-analytics/POST/export-analytics-data/
Описание: Экспортировать данные аналитики
Тело запроса: ExportDataDto
Ответ: ExportResultDto
Приоритет: 🎯 Средний
```

#### POST /analytics/reports/schedule

```
Папка: src/features/task-analytics/POST/schedule-report/
Описание: Настроить регулярные отчеты
Тело запроса: ScheduleReportDto
Ответ: ReportScheduledDto
Приоритет: 🎯 Средний
```

---

## 📸 PHOTO-ANALYSIS ENDPOINTS

### ➕ POST Endpoints

#### POST /photo/analyze/screenshot

```
Папка: src/features/photo-analysis/POST/analyze-task-screenshot/
Описание: Анализ скриншота задачи
Тело запроса: multipart/form-data (image file)
Ответ: ScreenshotAnalysisDto
Приоритет: 🎯 Средний
```

#### POST /photo/extract/text

```
Папка: src/features/photo-analysis/POST/extract-text-from-image/
Описание: Извлечение текста из изображения (OCR)
Тело запроса: multipart/form-data (image file)
Ответ: ExtractedTextDto
Приоритет: 🎯 Средний
```

#### POST /photo/detect/ui-elements

```
Папка: src/features/photo-analysis/POST/detect-ui-elements/
Описание: Детекция UI элементов на скриншоте
Тело запроса: multipart/form-data (image file)
Ответ: UIElementsDto
Приоритет: 🎯 Средний
```

#### POST /photo/compare

```
Папка: src/features/photo-analysis/POST/compare-images/
Описание: Сравнение двух изображений
Тело запроса: multipart/form-data (2 image files)
Ответ: ImageComparisonDto
Приоритет: 🎯 Средний
```

#### POST /photo/report

```
Папка: src/features/photo-analysis/POST/generate-image-report/
Описание: Генерация отчета по анализу изображений
Тело запроса: GenerateImageReportDto
Ответ: ImageReportDto
Приоритет: 🎯 Средний
```

### 📥 GET Endpoints

#### GET /photo/analysis/:id/history

```
Папка: src/features/photo-analysis/GET/get-analysis-history/
Описание: История анализов изображений
Параметры: analysisId (string)
Ответ: AnalysisHistoryDto
Приоритет: 🎯 Средний
```

#### GET /photo/formats

```
Папка: src/features/photo-analysis/GET/get-supported-formats/
Описание: Поддерживаемые форматы изображений
Ответ: SupportedFormatsDto
Приоритет: 🎯 Средний
```

#### GET /photo/templates

```
Папка: src/features/photo-analysis/GET/get-analysis-templates/
Описание: Шаблоны для анализа изображений
Ответ: AnalysisTemplatesDto
Приоритет: 🎯 Средний
```

---

## 🤖 AI-REPORTING ENDPOINTS

### ➕ POST Endpoints

#### POST /ai-reports/summary

```
Папка: src/features/ai-reporting/POST/generate-ai-summary/
Описание: AI генерация краткого отчета
Тело запроса: GenerateSummaryDto
Ответ: AISummaryDto
Приоритет: 🎯 Средний
```

#### POST /ai-reports/insights

```
Папка: src/features/ai-reporting/POST/create-insights-report/
Описание: AI анализ инсайтов и рекомендаций
Тело запроса: CreateInsightsDto
Ответ: AIInsightsDto
Приоритет: 🎯 Средний
```

#### POST /ai-reports/patterns

```
Папка: src/features/ai-reporting/POST/analyze-team-patterns/
Описание: AI анализ паттернов работы команды
Тело запроса: AnalyzePatternsDto
Ответ: TeamPatternsDto
Приоритет: 🎯 Средний
```

#### POST /ai-reports/predictions

```
Папка: src/features/ai-reporting/POST/predict-project-timeline/
Описание: AI предсказание сроков проекта
Тело запроса: PredictTimelineDto
Ответ: ProjectPredictionDto
Приоритет: 🎯 Средний
```

### 📥 GET Endpoints

#### GET /ai-reports/insights/:id

```
Папка: src/features/ai-reporting/GET/get-ai-insights/
Описание: Получить готовые AI инсайты
Параметры: insightId (string)
Ответ: AIInsightDto
Приоритет: 🎯 Средний
```

#### GET /ai-reports/accuracy

```
Папка: src/features/ai-reporting/GET/get-prediction-accuracy/
Описание: Точность AI предсказаний
Ответ: PredictionAccuracyDto
Приоритет: 🎯 Средний
```

#### GET /ai-reports/templates

```
Папка: src/features/ai-reporting/GET/get-report-templates/
Описание: Шаблоны AI отчетов
Ответ: ReportTemplatesDto
Приоритет: 🎯 Средний
```

---

## 🔌 ENHANCED JIRA-INTEGRATION ENDPOINTS

### 📥 GET Endpoints

#### GET /jira/boards/:id/config

```
Папка: src/features/jira-integration/GET/get-jira-board-config/
Описание: Конфигурация Jira доски
Параметры: boardId (string)
Ответ: JiraBoardConfigDto
Приоритет: 📊 Высокий
```

#### GET /jira/workflows

```
Папка: src/features/jira-integration/GET/get-jira-workflows/
Описание: Список workflow в Jira
Ответ: JiraWorkflowsDto
Приоритет: 📊 Высокий
```

#### GET /jira/fields/custom

```
Папка: src/features/jira-integration/GET/get-jira-custom-fields/
Описание: Кастомные поля Jira
Ответ: JiraCustomFieldsDto
Приоритет: 📊 Высокий
```

#### GET /jira/projects/:id/roles

```
Папка: src/features/jira-integration/GET/get-jira-project-roles/
Описание: Роли участников проекта в Jira
Параметры: projectId (string)
Ответ: JiraProjectRolesDto
Приоритет: 🎯 Средний
```

### ➕ POST Endpoints

#### POST /jira/sync

```
Папка: src/features/jira-integration/POST/sync-jira-data/
Описание: Синхронизация данных с Jira
Тело запроса: SyncJiraDto
Ответ: JiraSyncResultDto
Приоритет: 📊 Высокий
```

#### POST /jira/webhooks

```
Папка: src/features/jira-integration/POST/create-jira-webhook/
Описание: Создание webhook для Jira
Тело запроса: CreateJiraWebhookDto
Ответ: JiraWebhookCreatedDto
Приоритет: 📊 Высокий
```

#### POST /jira/import/history

```
Папка: src/features/jira-integration/POST/import-jira-history/
Описание: Импорт истории задач из Jira
Тело запроса: ImportJiraHistoryDto
Ответ: JiraImportResultDto
Приоритет: 🎯 Средний
```

#### POST /jira/backup

```
Папка: src/features/jira-integration/POST/backup-jira-config/
Описание: Резервное копирование конфигурации Jira
Тело запроса: BackupJiraConfigDto
Ответ: JiraBackupResultDto
Приоритет: 🎯 Средний
```

---

## 📋 Приоритизация разработки

### 🔥 КРИТИЧЕСКИЙ ПРИОРИТЕТ (Неделя 1-2)

```
KANBAN-MANAGEMENT:
- GET: get-task-details, get-tasks-by-column, get-board-structure
- POST: create-task, add-task-comment, assign-task
- PATCH: move-task-to-column, change-task-status, update-task-assignee
- PUT: update-task
```

### 📊 ВЫСОКИЙ ПРИОРИТЕТ (Неделя 3-4)

```
KANBAN-MANAGEMENT:
- GET: get-task-history, get-task-comments, get-assignee-tasks
- POST: create-board, create-column
- PUT: update-board, update-column, update-task-priority
- DELETE: delete-task

TASK-ANALYTICS:
- GET: get-productivity-metrics, get-team-performance, get-burndown-chart

JIRA-INTEGRATION:
- GET: get-jira-board-config, get-jira-workflows, get-jira-custom-fields
- POST: sync-jira-data, create-jira-webhook
```

### 🎯 СРЕДНИЙ ПРИОРИТЕТ (Неделя 5-6)

```
Все остальные эндпойнты:
- KANBAN-MANAGEMENT: статистика, проекты, вложения
- TASK-ANALYTICS: все POST эндпойнты
- PHOTO-ANALYSIS: все эндпойнты
- AI-REPORTING: все эндпойнты
- JIRA-INTEGRATION: импорт и бэкап
```

---

## 🛠️ Стандартная структура файлов

### Пример для каждого эндпойнта:

```
endpoint-name/
├── endpoint-name.controller.ts     # NestJS контроллер
├── endpoint-name.service.ts        # Бизнес логика
├── endpoint-name.request.dto.ts    # DTO для входных данных
├── endpoint-name.response.dto.ts   # DTO для ответа
├── endpoint-name.module.ts         # NestJS модуль
├── endpoint-name.spec.ts           # Unit тесты
└── openapi.decorator.ts            # Swagger документация
```

### Технические требования:

- ✅ Использовать только Yarn
- ✅ Полное покрытие тестами
- ✅ Swagger документация для всех эндпойнтов
- ✅ Валидация входных данных
- ✅ Логирование всех операций
- ✅ Error handling и graceful degradation

---

## 🎯 Success Metrics

### После завершения КРИТИЧЕСКОГО приоритета:

- ✅ AI агенты могут полностью управлять задачами
- ✅ Создание, перемещение, обновление задач работает
- ✅ Интеграция с InstructionExecutorService готова

### После завершения ВЫСОКОГО приоритета:

- ✅ Полное управление досками и проектами
- ✅ Базовая аналитика функционирует
- ✅ Углубленная Jira интеграция работает

### После завершения СРЕДНЕГО приоритета:

- ✅ Анализ изображений и AI отчеты готовы
- ✅ Система готова к production deployment
- ✅ Frontend может подключаться к полному API
