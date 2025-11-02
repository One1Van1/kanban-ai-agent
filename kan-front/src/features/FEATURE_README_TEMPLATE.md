# 📦 [Название блока]

## 🎯 Назначение

[Краткое описание — что делает этот блок и зачем он нужен]

## 📂 Структура

```
[feature-name]/
├── README.md              # Этот файл
├── components/            # Компоненты блока
├── hooks/                 # Хуки для логики блока
├── stores/                # Zustand store (состояние)
├── api/                   # API методы блока
├── types/                 # TypeScript типы
└── utils/                 # Вспомогательные функции
```

## 🔌 API методы

### Основные методы:

- `method1()` — описание
- `method2()` — описание
- `method3()` — описание

**Файл:** `api/[feature-name].api.ts`

## 🪝 Основные хуки

- `use[FeatureName]()` — главный хук блока
- `use[SpecificLogic]()` — специфичный хук

## 📊 Store (состояние)

**Файл:** `stores/[feature-name].store.ts`

**Основные поля состояния:**

- `field1` — описание
- `field2` — описание

**Основные actions:**

- `action1()` — описание
- `action2()` — описание

## 🧩 Компоненты

### Главные компоненты:

- `ComponentName` — описание

## 🔗 Зависимости

**От каких блоков зависит:**

- `shared` — использует общие UI компоненты
- `entities/[entity-name]` — использует модели данных

**Какие блоки зависят от этого:**

- Нет / [блок-name]

## 📝 Примеры использования

```tsx
import { useFeatureName } from '@/features/[feature-name]/hooks/use-feature-name';

function MyComponent() {
  const { data, loading, error } = useFeatureName();

  // ...
}
```

## 🚀 Запуск и тестирование

```bash
# Запуск приложения
yarn dev

# Тестирование (когда будет настроено)
# yarn test features/[feature-name]
```

---

**Дата создания:** [дата]  
**Последнее обновление:** [дата]
