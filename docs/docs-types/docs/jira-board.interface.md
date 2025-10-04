# jira-board.interface.ts

## Описание
Этот файл отвечает за типизацию канбан досок Jira и их конфигурации.

## Основные интерфейсы
- **JiraBoard** - структура канбан доски (id, name, type, location)
- **JiraBoardLocation** - привязка доски к проекту
- **JiraBoardsResponse** - ответ API со списком досок
- **JiraBoardConfiguration** - конфигурация доски и колонок
- **JiraColumn** - структура колонки доски
- **JiraColumnStatus** - статусы в колонке

## Типы досок
- **kanban** - канбан доска для continuous flow
- **scrum** - скрам доска для спринтов
- **simple** - простая доска без дополнительных функций

## Операции с досками
- **BoardTasksInColumnResponse** - задачи в конкретной колонке
- **GetBoardTasksRequest** - параметры запроса задач
- **BoardConfigurationResponse** - полная конфигурация доски

## Результат
- Полная типизация Jira Board API
- Поддержка всех типов досок
- Type safety для операций с колонками