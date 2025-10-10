# jira-integration.module.ts

## Описание
Этот файл отвечает за модуль интеграции с Jira API.

## Действия
- Автоматически загружает все контроллеры из папки jira-integration
- Автоматически загружает все сервисы из папки jira-integration
- Подключает базовые сервисы Jira (JiraBaseService, TimeLogger)
- Импортирует ConfigModule для доступа к Jira конфигурации
- Организует все компоненты Jira интеграции в единый модуль

## Зависимости
- JiraBaseService - базовые операции с Jira API
- JiraTimeLogger - логирование времени работы
- WorkflowConfigurator - настройка workflow
- ConfigModule - для доступа к настройкам Jira

## Результат
- Полностью настроенный модуль Jira интеграции
- Авто-загрузка всех компонентов
- Готовность к обработке webhook и API запросов