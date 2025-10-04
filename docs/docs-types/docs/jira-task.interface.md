# jira-task.interface.ts

## Описание
Этот файл отвечает за типизацию задач Jira и связанных с ними объектов.

## Основные интерфейсы
- **JiraTask** - полная структура задачи Jira
- **JiraTaskFields** - поля задачи (summary, description, status, assignee)
- **JiraUser** - информация о пользователе (accountId, displayName, email)
- **JiraStatus** - статус задачи с категорией и цветом
- **JiraPriority** - приоритет задачи с иконкой
- **JiraIssueType** - тип задачи (Story, Task, Bug)
- **JiraProject** - информация о проекте

## Вспомогательные интерфейсы
- **JiraTaskSearchResult** - результат поиска задач
- **JiraTaskTransitionsResponse** - доступные переходы
- **CreateJiraTaskRequest** - данные для создания задачи
- **UpdateJiraTaskRequest** - данные для обновления
- **AddJiraCommentRequest** - данные для комментария

## Результат
- Полная типизация Jira REST API v3
- Type safety для всех операций с задачами
- Автодополнение в IDE