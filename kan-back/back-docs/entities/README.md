# Database Entities

TypeORM сущности для работы с базой данных.

## 🎯 Назначение

Определение схемы базы данных через TypeORM entities с типизацией и валидацией.

## 📁 Структура сущностей

| Entity                        | Описание                | Основные поля                                    |
| ----------------------------- | ----------------------- | ------------------------------------------------ |
| `agent.entity.ts`             | AI агенты               | `id`, `name`, `type`, `status`, `config`         |
| `agent-instruction.entity.ts` | Инструкции для агентов  | `id`, `agentId`, `instruction`, `order`          |
| `flow.entity.ts`              | Визуальные флоу         | `id`, `name`, `blocks`, `edges`, `status`        |
| `task-history.entity.ts`      | История изменений задач | `id`, `taskId`, `changes`, `userId`, `timestamp` |
| `board-integration.entity.ts` | Интеграции с досками    | `id`, `type`, `credentials`, `syncSettings`      |
| `notification-log.entity.ts`  | Лог уведомлений         | `id`, `userId`, `message`, `status`, `sentAt`    |

## ⚙️ Основные возможности

- ✅ TypeORM декораторы для схемы
- ✅ Автоматические timestamps (`createdAt`, `updatedAt`)
- ✅ Связи между таблицами (relations)
- ✅ Индексы для оптимизации
- ✅ Валидация данных
- ✅ Soft delete поддержка

## 🔧 Использование

### Пример: agent.entity.ts

```typescript
@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: AgentType })
  type: AgentType;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @OneToMany(() => AgentInstruction, (instruction) => instruction.agent)
  instructions: AgentInstruction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Использование в сервисе

```typescript
constructor(
  @InjectRepository(Agent)
  private agentRepository: Repository<Agent>,
) {}

async findOne(id: string): Promise<Agent> {
  return this.agentRepository.findOne({
    where: { id },
    relations: ['instructions'],
  });
}
```

## 📊 Связи между сущностями

```
Agent (1) ──── (N) AgentInstruction
  │
  └──── (N) TaskHistory

Flow (1) ──── (N) Agent (конвертированные)

BoardIntegration (1) ──── (N) Tasks (синхронизация)

NotificationLog (N) ──── (1) User
```

## 🗄️ Миграции

При изменении entities автоматически генерируются миграции:

```bash
# Создать миграцию
yarn typeorm migration:generate -n MigrationName

# Применить миграции
yarn typeorm migration:run

# Откатить миграцию
yarn typeorm migration:revert
```

## 📋 Создание новой сущности

1. Создайте файл `entity-name.entity.ts`
2. Добавьте TypeORM декораторы
3. Определите связи с другими entities
4. Добавьте валидацию полей
5. Создайте миграцию
6. Обновите этот README

## 🔍 Важные декораторы

### Основные

- `@Entity('table_name')` - определяет таблицу
- `@PrimaryGeneratedColumn('uuid')` - первичный ключ
- `@Column()` - обычная колонка
- `@CreateDateColumn()` - автоматическая дата создания
- `@UpdateDateColumn()` - автоматическая дата обновления

### Связи

- `@OneToMany()` - один ко многим
- `@ManyToOne()` - многие к одному
- `@ManyToMany()` - многие ко многим
- `@JoinTable()` - промежуточная таблица

### Дополнительные

- `@Index()` - создать индекс
- `@Unique()` - уникальное значение
- `@DeleteDateColumn()` - soft delete

## 🎯 Best Practices

- ✅ Используйте UUID для ID
- ✅ Всегда добавляйте timestamps
- ✅ Используйте enum для статусов
- ✅ JSONB для гибких данных
- ✅ Индексы для частых запросов
- ✅ Валидация на уровне entity

## 🔗 Связи

**Используется в:**

- Database Management
- Все feature-модули (через repositories)
- Миграции базы данных
