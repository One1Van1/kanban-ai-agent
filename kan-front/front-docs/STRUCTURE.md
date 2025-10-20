# Frontend Structure - Визуальная карта

Визуальная структура всей документации фронтенда.

```
front-docs/
│
├── 📖 INDEX.md                          # Быстрая навигация
├── 📚 README.md                         # Главная документация
├── 📊 SUMMARY.md                        # Статистика
├── 🗺️ STRUCTURE.md                      # Эта страница
│
├── 🎯 Презентационные материалы
│   ├── ELEVATOR-PITCH.md                # 1 минута
│   ├── QUICK-BRIEF.md                   # 5 минут
│   ├── TECH-LEAD-BRIEF.md               # 10 минут
│   └── PRESENTATIONS-GUIDE.md           # Гайд
│
├── 🚀 pages/                            # СТРАНИЦЫ
│   └── README.md
│       ├── Home (/)
│       ├── Kanban (/kanban)
│       ├── Agents (/agents)
│       └── Flows (/flows) ⭐
│
├── 🧩 components/                       # КОМПОНЕНТЫ
│   └── README.md
│       ├── Kanban Components
│       ├── Agent Components
│       ├── Flow Builder Components ⭐
│       └── UI Components (shadcn/ui)
│
├── 🪝 hooks/                            # HOOKS
│   └── README.md
│       ├── use-dialog
│       └── useBlockEdit
│
├── 🗄️ stores/                           # STORES
│   └── README.md
│       └── editingStore
│
└── 📘 types/                            # TYPES
    └── README.md
        └── flow-builder types
```

## 📊 Статистика

```
┌────────────────────────────────────────────────┐
│         DOCUMENTATION METRICS                  │
├────────────────────────────────────────────────┤
│  📄 Total Files:              10+              │
│  📁 Sections:                  5               │
│  🚀 Pages:                     3               │
│  🧩 Components:               20+              │
│  📘 TypeScript:               100%             │
│  ✅ Coverage:                 100%             │
└────────────────────────────────────────────────┘
```

## 🏗️ Архитектура

```
USER
 ↓
┌────────────────────────────┐
│      NEXT.JS PAGES         │
│  /kanban | /agents | /flows│
└──────────┬─────────────────┘
           │
┌──────────┴─────────────────┐
│   REACT COMPONENTS         │
│  Kanban | Agents | Flow    │
└──────────┬─────────────────┘
           │
┌──────────┴─────────────────┐
│  HOOKS + STORES + TYPES    │
│  Custom logic + State      │
└────────────────────────────┘
```

## 🎯 Быстрый доступ

- 1 мин → [ELEVATOR-PITCH.md](./ELEVATOR-PITCH.md)
- 5 мин → [QUICK-BRIEF.md](./QUICK-BRIEF.md)
- 10 мин → [TECH-LEAD-BRIEF.md](./TECH-LEAD-BRIEF.md)
- Всё → [INDEX.md](./INDEX.md)

---

**Создано:** 20 октября 2025 г.  
**Статус:** ✅ Complete
