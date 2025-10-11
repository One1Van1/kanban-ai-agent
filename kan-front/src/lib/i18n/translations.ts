export const translations = {
  ru: {
    // Navigation
    navigation: {
      home: 'Главная',
      agents: 'Агенты',
      allAgents: 'Все агенты',
      createAgent: 'Создать агента',
      flowBuilder: 'Flow Builder',
      kanban: 'Kanban',
    },

    // Home page
    home: {
      title: 'AI-Powered',
      titleHighlight: 'Kanban Management',
      subtitle:
        'Интеллектуальные агенты, которые автоматизируют ваш рабочий процесс и повышают продуктивность команды.',

      // Metrics
      metrics: {
        activeAgents: 'Активные агенты',
        tasksProcessed: 'Обработано задач',
        completionRate: 'Процент завершения',
        responseTime: 'Время отклика',
        fromLastWeek: 'с прошлой недели',
        fromLastMonth: 'с прошлого месяца',
        fromLastWeek2: 'с прошлой недели',
      },

      // Quick Actions
      quickActions: {
        title: 'Быстрые действия',
        createNewAgent: {
          title: 'Создать нового агента',
          description:
            'Настройте нового AI агента для автоматизации вашего рабочего процесса',
        },
        viewAllAgents: {
          title: 'Просмотреть всех агентов',
          description: 'Управляйте и мониторьте ваших существующих агентов',
        },
        kanbanBoards: {
          title: 'Kanban доски',
          description: 'Получите доступ к вашим проектным доскам и задачам',
        },
      },
    },

    // Agents page
    agents: {
      title: 'AI Агенты',
      subtitle: 'Управляйте вашими интеллектуальными агентами',
      createAgent: 'Создать агента',
      createNew: 'Создать нового агента',
      noAgents: 'У вас пока нет агентов',
      noAgentsDescription:
        'Создайте своего первого AI агента для автоматизации задач',
      noAgentsDesc: 'Создайте своего первого AI агента для автоматизации задач',

      // Loading and error states
      loading: 'Загрузка агентов...',
      errorTitle: 'Ошибка загрузки агентов',
      activeCount: 'Активно агентов',

      // Agent details
      noDescription: 'Нет описания',
      created: 'Создан',
      updated: 'Обновлен',
      boardType: 'Тип доски',
      configure: 'Настроить агента',

      // Agent statuses
      status: {
        active: 'Агенты успешно создаются!',
        inactive: 'Неактивен',
        error: 'Ошибка',
      },

      // Agent actions
      actions: {
        view: 'Просмотр',
        edit: 'Редактировать',
        delete: 'Удалить',
        activate: 'Активировать',
        deactivate: 'Деактивировать',
      },

      // Agent features
      features: {
        automation: {
          title: 'Автоматизация Задач',
          description:
            'Создавайте агентов, которые автоматически комментируют задачи, перемещают их между колонками и уведомляют участников команды.',
        },
        monitoring: {
          title: 'Умный Мониторинг',
          description:
            'Агенты могут отслеживать прогресс задач, выявлять узкие места и предлагать улучшения рабочего процесса.',
        },
        configuration: {
          title: 'Простая Настройка',
          description:
            'Настройте агентов с помощью простых инструкций и позвольте им автоматически обрабатывать повторяющиеся задачи.',
        },
      },
    },

    // Create Agent page
    createAgent: {
      title: 'Создать нового агента',
      subtitle: 'Настройте AI агента для автоматизации ваших задач',
      backToAgents: 'Назад к агентам',

      // Form fields
      form: {
        title: 'Конфигурация Агента',
        description:
          'Определите основные свойства и поведение вашего AI агента',
        name: 'Название агента',
        namePlaceholder: 'Введите название агента',
        agentDescription: 'Описание',
        descriptionPlaceholder: 'Опишите, что будет делать этот агент',
        model: 'AI Модель',
        temperature: 'Температура',
        maxTokens: 'Максимум токенов',
        instructions: 'Инструкции',
        instructionsPlaceholder: 'Введите инструкции для агента',
        boardType: 'Тип доски',
        selectBoardType: 'Выберите тип доски',
        createAgent: 'Создать Агента',
        creating: 'Создание...',
        cancel: 'Отмена',
      },

      // Validation messages
      validation: {
        nameRequired: 'Название агента обязательно',
        instructionsRequired: 'Инструкции обязательны',
      },

      // Success/Error messages
      messages: {
        success: 'Агент успешно создан!',
        error: 'Не удалось создать агента',
      },

      // Board types
      boardTypes: {
        jira: 'Jira',
        trello: 'Trello',
        linear: 'Linear',
        asana: 'Asana',
        notion: 'Notion',
        github: 'GitHub Projects',
        custom: 'Пользовательский',
      },
    },

    // Kanban page
    kanban: {
      title: 'Kanban Доски',
      subtitle: 'Управляйте вашими проектами и задачами',
      createBoard: 'Создать доску',
      openBoard: 'Открыть доску',
      tasks: 'задач',
      agents: 'агентов',

      // Sample boards
      boards: {
        development: {
          name: 'Спринт разработки',
          description: 'Текущие задачи разработки и функции',
        },
        qa: {
          name: 'Тестирование QA',
          description: 'Рабочий процесс обеспечения качества и тестирования',
        },
        backlog: {
          name: 'Бэклог продукта',
          description: 'Будущие функции и улучшения',
        },
      },

      // No boards state
      noBoards: {
        title: 'У вас пока нет досок',
        description: 'Создайте свою первую Kanban доску для начала работы',
      },

      // Board info
      board: {
        tasks: 'задач',
        activeAgents: 'активных агентов',
        viewBoard: 'Открыть доску',
      },
    },

    // Flow Builder page
    flowBuilder: {
      title: 'Flow Builder',
      subtitle: 'Создавайте визуальные рабочие процессы для ваших агентов',
      beta: 'Beta',
      comingSoon: 'Скоро',
      description:
        'Мы создаём визуальный конструктор на основе требований вашего тимлида. Он будет включать drag & drop интерфейс для создания сложных AI рабочих процессов.',

      steps: {
        universal: {
          title: 'Универсальные Триггеры',
          description:
            'Работает с ЛЮБОЙ системой досок: Jira, Trello, Asana, Notion, Monday.com, ClickUp или обычные вебхуки',
        },
        smartLogic: {
          title: 'Умная Логика и AI',
          description:
            'Условная логика, AI запросы для анализа изображений, файлов и продвинутые уведомления',
        },
        testDeploy: {
          title: 'Тестируйте и Развертывайте',
          description:
            'Тестируйте с вашей системой досок, проверяйте рабочие процессы и развертывайте в продакшн',
        },
      },

      example: {
        title: 'Пример: Универсальный Flow анализа фото',
        description:
          'Работает с ЛЮБОЙ системой досок - не только Jira! Ваш тимлид упомянул Jira как пример для тестирования.',
        flowLogic: 'Универсальная логика Flow',
        flowDescription:
          'Когда карточка перемещается в "В работе" на ЛЮБОЙ доске → Извлечь фото пользователей → Если фото существуют → Отправить в AI для анализа → Создать DOCX отчёт, иначе → Добавить комментарий с просьбой фото',
        compatibility: 'Работает с',
        supportedPlatforms:
          'Jira, Trello, Asana, Notion, Monday.com, ClickUp, Linear, GitHub Projects или любые пользовательские доски через вебхуки!',
      },

      blocks: {
        trigger: 'Триггер движения доски',
        extractFiles: 'Извлечь файлы',
        condition: 'ЕСЛИ/ИНАЧЕ',
        aiAnalysis: 'AI Анализ',
        waitResponse: 'Ждать ответ',
        createReport: 'Создать отчёт',
      },

      features: {
        title: 'Функции в разработке',
        trigger: 'Блоки триггеров (интеграция с Jira)',
        contextExtraction: 'Извлечение контекста (файлы, переменные)',
        conditionalLogic: 'Условная логика (ЕСЛИ/ИНАЧЕ, циклы)',
        actionBlocks: 'Блоки действий (AI запросы, комментарии, файлы)',
        waitBlocks: 'Блоки ожидания (асинхронные операции)',
        visualCanvas: 'Визуальный холст с React Flow',
        propertiesPanel: 'Панель свойств',
        blockPalette: 'Палитра блоков',
        flowTesting: 'Тестирование и развертывание Flow',
      },

      launchBuilder: 'Запустить Builder (Скоро)',
      technicalNote: 'Техническая заметка',
      technicalStatus:
        'Все компоненты Flow Builder созданы и готовы. В данный момент решаем интеграцию React Flow TypeScript для визуального холста.',
    },

    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      cancel: 'Отмена',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      view: 'Просмотр',
      create: 'Создать',
      update: 'Обновить',
      search: 'Поиск',
      filter: 'Фильтр',
      sort: 'Сортировка',
      tryAgain: 'Попробовать снова',
      actions: 'Действия',
      settings: 'Настройки',
      profile: 'Профиль',
      logout: 'Выйти',
      language: 'Язык',
      theme: 'Тема',
      systemWorking: 'Система работает',
    },

    // Footer
    footer: {
      systemStatus: 'Система работает',
    },
  },

  en: {
    // Navigation
    navigation: {
      home: 'Home',
      agents: 'Agents',
      allAgents: 'All Agents',
      createAgent: 'Create Agent',
      flowBuilder: 'Flow Builder',
      kanban: 'Kanban',
    },

    // Home page
    home: {
      title: 'AI-Powered',
      titleHighlight: 'Kanban Management',
      subtitle:
        'Intelligent agents that automate your workflow and boost team productivity.',

      // Metrics
      metrics: {
        activeAgents: 'Active Agents',
        tasksProcessed: 'Tasks Processed',
        completionRate: 'Completion Rate',
        responseTime: 'Response Time',
        fromLastWeek: 'from last week',
        fromLastMonth: 'from last month',
        fromLastWeek2: 'from last week',
      },

      // Quick Actions
      quickActions: {
        title: 'Quick Actions',
        createNewAgent: {
          title: 'Create New Agent',
          description: 'Set up a new AI agent to automate your workflow',
        },
        viewAllAgents: {
          title: 'View All Agents',
          description: 'Manage and monitor your existing agents',
        },
        kanbanBoards: {
          title: 'Kanban Boards',
          description: 'Access your project boards and tasks',
        },
      },
    },

    // Agents page
    agents: {
      title: 'AI Agents',
      subtitle: 'Manage your intelligent agents',
      createAgent: 'Create Agent',
      createNew: 'Create New Agent',
      noAgents: "You don't have any agents yet",
      noAgentsDescription: 'Create your first AI agent to automate tasks',
      noAgentsDesc: 'Create your first AI agent to automate tasks',

      // Loading and error states
      loading: 'Loading agents...',
      errorTitle: 'Error loading agents',
      activeCount: 'Active agents',

      // Agent details
      noDescription: 'No description',
      created: 'Created',
      updated: 'Updated',
      boardType: 'Board type',
      configure: 'Configure agent',

      // Agent statuses
      status: {
        active: 'Agents are being created successfully!',
        inactive: 'Inactive',
        error: 'Error',
      },

      // Agent actions
      actions: {
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        activate: 'Activate',
        deactivate: 'Deactivate',
      },

      // Agent features
      features: {
        automation: {
          title: 'Task Automation',
          description:
            'Create agents that automatically comment on tasks, move them between columns, and notify team members.',
        },
        monitoring: {
          title: 'Smart Monitoring',
          description:
            'Agents can monitor task progress, detect bottlenecks, and suggest improvements to your workflow.',
        },
        configuration: {
          title: 'Easy Configuration',
          description:
            'Set up agents with simple instructions and let them handle repetitive tasks automatically.',
        },
      },
    },

    // Create Agent page
    createAgent: {
      title: 'Create New Agent',
      subtitle: 'Set up an AI agent to automate your tasks',
      backToAgents: 'Back to Agents',

      // Form fields
      form: {
        title: 'Agent Configuration',
        description:
          'Define the basic properties and behavior of your AI agent',
        name: 'Agent Name',
        namePlaceholder: 'Enter agent name',
        agentDescription: 'Description',
        descriptionPlaceholder: 'Describe what this agent will do',
        model: 'AI Model',
        temperature: 'Temperature',
        maxTokens: 'Max Tokens',
        instructions: 'Instructions',
        instructionsPlaceholder: 'Enter instructions for the agent',
        boardType: 'Board Type',
        selectBoardType: 'Select board type',
        createAgent: 'Create Agent',
        creating: 'Creating...',
        cancel: 'Cancel',
      },

      // Validation messages
      validation: {
        nameRequired: 'Agent name is required',
        instructionsRequired: 'Instructions are required',
      },

      // Success/Error messages
      messages: {
        success: 'Agent created successfully!',
        error: 'Failed to create agent',
      },

      // Board types
      boardTypes: {
        jira: 'Jira',
        trello: 'Trello',
        linear: 'Linear',
        asana: 'Asana',
        notion: 'Notion',
        github: 'GitHub Projects',
        custom: 'Custom',
      },
    },

    // Kanban page
    kanban: {
      title: 'Kanban Boards',
      subtitle: 'Manage your projects and tasks',
      createBoard: 'Create Board',
      openBoard: 'Open Board',
      tasks: 'tasks',
      agents: 'agents',

      // Sample boards
      boards: {
        development: {
          name: 'Development Sprint',
          description: 'Current development tasks and features',
        },
        qa: {
          name: 'QA Testing',
          description: 'Quality assurance and testing workflow',
        },
        backlog: {
          name: 'Product Backlog',
          description: 'Future features and improvements',
        },
      },

      // No boards state
      noBoards: {
        title: "You don't have any boards yet",
        description: 'Create your first Kanban board to get started',
      },

      // Board info
      board: {
        tasks: 'tasks',
        activeAgents: 'active agents',
        viewBoard: 'View Board',
      },
    },

    // Flow Builder page
    flowBuilder: {
      title: 'Flow Builder',
      subtitle: 'Create visual workflows for your agents',
      beta: 'Beta',
      comingSoon: 'Coming Soon',
      description:
        "We are building the visual flow builder based on your team lead's requirements. It will include drag & drop interface for creating complex AI workflows.",

      steps: {
        universal: {
          title: 'Universal Triggers',
          description:
            'Works with ANY board system: Jira, Trello, Asana, Notion, Monday.com, ClickUp or generic webhooks',
        },
        smartLogic: {
          title: 'Smart Logic & AI',
          description:
            'Conditional logic, AI requests for visual, file analysis & advanced notifications',
        },
        testDeploy: {
          title: 'Test & Deploy',
          description:
            'Test with your board system, validate workflows, and deploy to production',
        },
      },

      example: {
        title: 'Example: Universal Photo Analysis Flow',
        description:
          'Works with ANY board system - not just Jira! Your team lead mentioned Jira as an example for testing.',
        flowLogic: 'Universal Flow Logic',
        flowDescription:
          'When card moves to "В работе" on ANY board → Extract user photos → If photos exist → Send to AI for analysis → Create DOCX report, else → Add comment asking for photos',
        compatibility: 'Works with',
        supportedPlatforms:
          'Jira, Trello, Asana, Notion, Monday.com, ClickUp, Linear, GitHub Projects, or any custom board via webhooks!',
      },

      blocks: {
        trigger: 'Board Move Trigger',
        extractFiles: 'Extract Files',
        condition: 'IF/ELSE',
        aiAnalysis: 'AI Analysis',
        waitResponse: 'Wait Response',
        createReport: 'Create Report',
      },

      features: {
        title: 'Features in development',
        trigger: 'Trigger blocks (Jira integration)',
        contextExtraction: 'Context extraction (files, variables)',
        conditionalLogic: 'Conditional logic (IF/ELSE, loops)',
        actionBlocks: 'Action blocks (AI requests, comments, files)',
        waitBlocks: 'Wait blocks (async operations)',
        visualCanvas: 'Visual canvas with React Flow',
        propertiesPanel: 'Properties panel',
        blockPalette: 'Block palette',
        flowTesting: 'Flow testing & deployment',
      },

      launchBuilder: 'Launch Builder (Coming Soon)',
      technicalNote: 'Technical Note',
      technicalStatus:
        'All Flow Builder components are created and ready. Currently resolving React Flow TypeScript integration for the visual canvas.',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      create: 'Create',
      update: 'Update',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      tryAgain: 'Try Again',
      actions: 'Actions',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      language: 'Language',
      theme: 'Theme',
      systemWorking: 'System Online',
    },

    // Footer
    footer: {
      systemStatus: 'System Online',
    },
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
