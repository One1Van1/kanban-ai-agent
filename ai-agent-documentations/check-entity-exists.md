# Check Entity Exists API

## Описание

Эндпойнт для проверки существования entity в проекте.

## Endpoint

```
POST /ai-agent/check-entity-exists
```

## Описание функциональности

Проверяет существует ли указанная сущность (entity) в папке `src/entities/` или других стандартных местах проекта. Возвращает информацию о найденной сущности, включая её поля и расположение.

## Параметры запроса

### Request Body

```json
{
  "entityName": "Order"
}
```

| Поле       | Тип    | Обязательный | Описание                       | Пример                     |
| ---------- | ------ | ------------ | ------------------------------ | -------------------------- |
| entityName | string | Да           | Название сущности для проверки | "User", "Order", "Product" |

## Пример запроса

```bash
curl -X POST http://localhost:3000/ai-agent/check-entity-exists \
  -H "Content-Type: application/json" \
  -d '{
    "entityName": "Order"
  }'
```

## Ответы

### Успешный ответ - сущность найдена (200)

```json
{
  "entityName": "Order",
  "exists": true,
  "filePath": "/Users/project/src/entities/order.entity.ts",
  "relativePath": "src/entities/order.entity.ts",
  "fields": [
    {
      "name": "id",
      "type": "number",
      "decorators": ["@PrimaryGeneratedColumn()"],
      "isRequired": true
    },
    {
      "name": "userId",
      "type": "number",
      "decorators": ["@Column()"],
      "isRequired": true
    },
    {
      "name": "totalAmount",
      "type": "number",
      "decorators": ["@Column('decimal', { precision: 10, scale: 2 })"],
      "isRequired": true
    },
    {
      "name": "status",
      "type": "OrderStatus",
      "decorators": ["@Column({ type: 'enum', enum: OrderStatus })"],
      "isRequired": true
    },
    {
      "name": "createdAt",
      "type": "Date",
      "decorators": ["@CreateDateColumn()"],
      "isRequired": false
    }
  ],
  "imports": ["Entity", "PrimaryGeneratedColumn", "Column", "CreateDateColumn"],
  "relationships": [
    {
      "name": "user",
      "type": "ManyToOne",
      "target": "User",
      "decorator": "@ManyToOne(() => User)"
    }
  ],
  "lastModified": "2025-09-23T12:30:00.000Z",
  "fileSize": 2048
}
```

### Успешный ответ - сущность не найдена (200)

```json
{
  "entityName": "NonExistentEntity",
  "exists": false,
  "searchedPaths": [
    "src/entities/non-existent-entity.entity.ts",
    "src/models/non-existent-entity.model.ts",
    "src/database/entities/non-existent-entity.entity.ts"
  ],
  "suggestions": ["User", "Order", "Product"]
}
```

### Структура ответа (когда exists: true)

| Поле          | Тип     | Описание                            |
| ------------- | ------- | ----------------------------------- |
| entityName    | string  | Название проверяемой сущности       |
| exists        | boolean | Существует ли сущность              |
| filePath      | string  | Полный путь к файлу сущности        |
| relativePath  | string  | Относительный путь от корня проекта |
| fields        | array   | Массив полей сущности               |
| imports       | array   | Список импортируемых декораторов    |
| relationships | array   | Связи с другими сущностями          |
| lastModified  | string  | Дата последнего изменения файла     |
| fileSize      | number  | Размер файла в байтах               |

### Структура объекта field

| Поле       | Тип     | Описание            |
| ---------- | ------- | ------------------- |
| name       | string  | Название поля       |
| type       | string  | Тип данных поля     |
| decorators | array   | Декораторы TypeORM  |
| isRequired | boolean | Обязательность поля |

### Структура объекта relationship

| Поле      | Тип    | Описание                                               |
| --------- | ------ | ------------------------------------------------------ |
| name      | string | Название связи                                         |
| type      | string | Тип связи (OneToOne, OneToMany, ManyToOne, ManyToMany) |
| target    | string | Целевая сущность                                       |
| decorator | string | Полный декоратор связи                                 |

## Возможные ошибки

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "entityName is required",
  "error": "Bad Request"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Error reading entity files",
  "error": "Internal Server Error"
}
```

## Поиск сущностей

### Поддерживаемые пути

Сервис ищет сущности в следующих местах:

1. `src/entities/` - основная папка для entities
2. `src/models/` - альтернативная папка для моделей
3. `src/database/entities/` - структурированные entities
4. `src/generated/entities/` - сгенерированные entities

### Поддерживаемые форматы имён файлов

- `entity-name.entity.ts`
- `entity-name.model.ts`
- `EntityName.ts`
- `entity_name.entity.ts`

### Регистронезависимый поиск

Поиск выполняется без учёта регистра:

- "user" найдёт "User.entity.ts"
- "ORDER" найдёт "order.entity.ts"
- "productCategory" найдёт "product-category.entity.ts"

## Анализ содержимого

### Парсинг TypeORM декораторов

Сервис распознаёт и анализирует:

- `@Entity()` - основной декоратор сущности
- `@PrimaryGeneratedColumn()` - автоинкрементный ID
- `@PrimaryColumn()` - кастомный первичный ключ
- `@Column()` - обычные колонки с опциями
- `@CreateDateColumn()` - автоматическая дата создания
- `@UpdateDateColumn()` - автоматическая дата обновления

### Парсинг связей

- `@OneToOne()` - связь один к одному
- `@OneToMany()` - связь один ко многим
- `@ManyToOne()` - связь многие к одному
- `@ManyToMany()` - связь многие ко многим

### Определение типов данных

- Примитивные типы: `string`, `number`, `boolean`, `Date`
- Enum типы: пользовательские перечисления
- Сложные типы: объекты и интерфейсы
- Массивы и объединения типов

## Кэширование

### Кэш файловой системы

- Результаты поиска кэшируются на 5 минут
- Кэш сбрасывается при изменении файлов
- Использует file system watchers для отслеживания изменений

### Кэш парсинга

- Распарсенная структура сущностей кэшируется
- Кэш обновляется при изменении файлов
- Ускоряет повторные запросы

## Использование

### В AI агенте

Используется для:

- Проверки перед созданием новых сущностей
- Анализа зависимостей между сущностями
- Валидации ссылок в задачах
- Планирования архитектуры

### В разработке

Полезно для:

- Быстрого анализа структуры проекта
- Документирования существующих моделей
- Рефакторинга и миграций
- Code review и аудита

## Интеграция с IDE

### VS Code Extension

Возможная интеграция для:

- Автодополнения имён сущностей
- Быстрого перехода к определению
- Показа структуры в hover
- Валидации ссылок

### Swagger UI

Встроен в общую документацию API для:

- Тестирования из браузера
- Интеграции с другими сервисами
- Автоматической генерации клиентского кода

## Примеры использования

### Проверка перед созданием

```javascript
// Перед созданием новой сущности
const orderExists = await checkEntityExists('Order');
if (orderExists.exists) {
  console.log(`Order entity already exists at: ${orderExists.filePath}`);
  console.log(`Fields: ${orderExists.fields.map((f) => f.name).join(', ')}`);
}
```

### Анализ зависимостей

```javascript
// Поиск всех сущностей с связями
const entities = ['User', 'Order', 'Product'];
const analysis = await Promise.all(
  entities.map((name) => checkEntityExists(name)),
);

const relationships = analysis
  .filter((e) => e.exists)
  .flatMap((e) => e.relationships);
```

## Мониторинг и логирование

- Логирование всех запросов с временными метками
- Статистика популярности проверки сущностей
- Отслеживание ошибок парсинга файлов
- Метрики производительности поиска

## Планы развития

- Поддержка других ORM (Prisma, Sequelize)
- Анализ GraphQL схем
- Интеграция с базой данных для валидации
- Автоматические диаграммы ER

## Теги Swagger

- **ai-agent** - Эндпойнты AI агента
