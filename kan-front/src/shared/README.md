# 🔧 Shared (Общие ресурсы)

## 🎯 Назначение

**Shared** содержит общие ресурсы, которые используются во **всех блоках** приложения.

Это переиспользуемые компоненты, хуки, утилиты, типы и конфигурации.

---

## 📂 Структура

```
shared/
├── README.md                  # Этот файл
│
├── components/                # Общие компоненты
│   ├── ui/                    # UI компоненты (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (другие UI)
│   │
│   └── common/                # Общие компоненты приложения
│       ├── theme-provider.tsx  # Provider темы
│       ├── mode-toggle.tsx     # Переключатель темы
│       └── language-toggle.tsx # Переключатель языка
│
├── hooks/                     # Общие хуки
│   ├── use-dialog.tsx         # Хук для управления диалогами
│   └── useBlockEdit.ts        # Хук для редактирования блоков
│
├── api/                       # Базовый HTTP клиент
│   ├── http-client.ts         # Axios клиент
│   ├── interceptors.ts        # Interceptors
│   └── types.ts               # Типы для API
│
├── types/                     # Глобальные TypeScript типы
│   └── index.ts
│
├── utils/                     # Утилиты
│   └── utils.ts               # cn() и другие helpers
│
├── i18n/                      # Интернационализация
│   └── translations.ts        # Переводы
│
└── config/                    # Конфигурации (будущее)
    └── env.ts
```

---

## 🧩 UI Компоненты

### Список компонентов (shadcn/ui):

- `Button` — кнопки
- `Input` — текстовые поля
- `Card` — карточки
- `Dialog` — модальные окна
- `Select` — выпадающие списки
- `Table` — таблицы
- `Tabs` — вкладки
- `Badge` — бейджи
- `Alert` — алерты
- `Textarea` — многострочные поля
- `Label` — лейблы
- `Dropdown Menu` — выпадающие меню
- `Sidebar` — боковая панель
- `Sonner` — тосты/уведомления
- `Language Selector` — селектор языка

**Импорт:**

```tsx
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card } from '@/shared/components/ui/card';
```

---

## 🎨 Общие компоненты

### `ThemeProvider`

Провайдер темы для всего приложения (light/dark mode).

**Использование:**

```tsx
import { ThemeProvider } from '@/shared/components/common/theme-provider';

<ThemeProvider defaultTheme="dark">
  <App />
</ThemeProvider>;
```

### `ModeToggle`

Переключатель темы (light/dark).

**Использование:**

```tsx
import { ModeToggle } from '@/shared/components/common/mode-toggle';

<ModeToggle />;
```

### `LanguageToggle`

Переключатель языка приложения.

**Использование:**

```tsx
import { LanguageToggle } from '@/shared/components/common/language-toggle';

<LanguageToggle />;
```

---

## 🪝 Хуки

### `useDialog`

Хук для управления состоянием диалогов.

**Использование:**

```tsx
import { useDialog } from '@/shared/hooks/use-dialog';

const { isOpen, open, close } = useDialog();
```

### `useBlockEdit`

Хук для редактирования блоков в flow builder.

---

## 🌐 HTTP Клиент

### `httpClient`

Базовый HTTP клиент на основе axios.

**Методы:**

- `get<T>(url, config)` — GET запрос
- `post<T>(url, data, config)` — POST запрос
- `put<T>(url, data, config)` — PUT запрос
- `patch<T>(url, data, config)` — PATCH запрос
- `delete<T>(url, config)` — DELETE запрос

**Использование:**

```tsx
import { httpClient } from '@/shared/api/http-client';

const data = await httpClient.get('/api/endpoint');
```

---

## 🛠️ Утилиты

### `cn()`

Утилита для объединения CSS классов (clsx + tailwind-merge).

**Использование:**

```tsx
import { cn } from '@/shared/utils/utils';

<div className={cn('base-class', condition && 'conditional-class')} />;
```

---

## 🌍 Интернационализация (i18n)

Переводы для многоязычности приложения.

**Файлы:**

- `i18n/translations.ts` — все переводы

---

## 📝 Правила использования

1. **Только общие ресурсы** — сюда попадает только то, что используется **в нескольких блоках**
2. **Не добавлять бизнес-логику** — только UI и утилиты
3. **Переиспользуемость** — всё в shared должно быть максимально универсально
4. **Независимость** — shared **НЕ** должен импортировать из features

---

## 🚫 Чего НЕ должно быть в shared

❌ Бизнес-логика конкретных блоков  
❌ API методы для конкретных фич (они в `features/[name]/api/`)  
❌ Специфичные компоненты блоков  
❌ Stores (они в `features/[name]/stores/`)

---

## ✅ Что ДОЛЖНО быть в shared

✅ UI компоненты (Button, Input и т.д.)  
✅ Общие хуки (useDialog, useDebounce)  
✅ Базовый HTTP клиент  
✅ Утилиты (cn, formatters)  
✅ Глобальные типы  
✅ Конфигурации  
✅ i18n

---

**Дата создания:** 2 ноября 2025  
**Последнее обновление:** 2 ноября 2025
