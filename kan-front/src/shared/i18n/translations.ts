export const translations = {
  ru: {
    // Navigation
    navigation: {
      home: 'Главная',
      agents: 'Агенты',
      allAgents: 'Все агенты',
      createAgent: 'Создать агента',
      flowBuilder: 'Создание потока',
      flowEditor: 'Редактирование потока',
      flows: 'Потоки',
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
        active: 'Активен',
        inactive: 'Неактивен',
        paused: 'Приостановлен',
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

    // Flows page
    flows: {
      title: 'Управление потоками',
      subtitle: 'Управляйте вашими автоматизированными потоками',
      createFlow: 'Создать поток',
      noFlows: 'У вас пока нет потоков',
      noFlowsDescription:
        'Создайте ваш первый поток для автоматизации процессов',

      // Loading and error states
      loading: 'Загрузка потоков...',
      errorTitle: 'Ошибка загрузки потоков',
      loadingError: 'Не удалось загрузить потоки',

      // Stats
      stats: {
        totalFlows: 'Всего потоков',
        activeFlows: 'Активных',
        drafts: 'Черновики',
        avgBlocks: 'Среднее блоков',
        blocks: 'блоков',
      },

      // Детали потока
      noDescription: 'Нет описания',
      created: 'Создан',
      updated: 'Обновлен',
      createdBy: 'Создатель',

      // Статусы потоков
      status: {
        draft: 'Черновик',
        active: 'Активен',
        archived: 'Архивирован',
      },

      // Действия с потоками
      actions: {
        execute: 'Выполнить',
        clone: 'Клонировать',
        edit: 'Редактировать',
        delete: 'Удалить',
        deploy: 'Развернуть в Agent',
        view: 'Просмотр',
        refresh: 'Обновить',
      },

      // Search and filters
      search: {
        placeholder: 'Поиск потоков...',
        status: 'Статус',
        all: 'Все',
      },

      // Execution messages
      execution: {
        started: 'выполнение запущено!',
        failed: 'Не удалось выполнить поток:',
      },

      // Clone messages
      clone: {
        success: 'клонирован успешно!',
        failed: 'Не удалось клонировать поток:',
      },

      // Delete messages
      delete: {
        confirm: 'Вы уверены, что хотите удалить этот поток?',
        success: 'удален успешно!',
        failed: 'Не удалось удалить поток:',
      },

      // Deploy messages
      deploy: {
        success: 'Поток успешно развернут в Agent',
        failed: 'Не удалось развернуть поток в Agent:',
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

    // Конструктор потоков
    flowBuilder: {
      title: 'Конструктор ИИ потоков',
      subtitle: 'Создайте AI-агента с помощью визуального конструктора',
      createDemo: 'Создать демо',
      test: 'Тест',
      save: 'Сохранить',
      cancel: 'Отменить',
      editMode: 'Редактирование',

      // Block Palette
      blockPalette: {
        title: 'Палитра блоков',
        subtitle: 'Перетащите блоки на холст, чтобы создать поток',
        categories: {
          trigger: 'Триггеры',
          context: 'Контекст',
          logic: 'Логика',
          action: 'Действия',
          wait: 'Ожидание',
        },
        blocks: {
          // ===========================
          // TRIGGERS - UNIVERSAL
          // ===========================
          board_move: {
            name: 'Перемещение карточки',
            description: 'Срабатывает при перемещении карточки между колонками',
          },
          board_create: {
            name: 'Создание карточки',
            description: 'Срабатывает при создании новой карточки',
          },
          webhook: {
            name: 'Вебхук',
            description: 'Срабатывает при внешнем вебхук запросе',
          },
          schedule: {
            name: 'Расписание',
            description: 'Срабатывает в определенное время или интервалы',
          },
          event_listener: {
            name: 'Слушатель событий',
            description: 'Универсальный триггер для любых событий системы',
          },
          manual_trigger: {
            name: 'Ручной запуск',
            description: 'Запуск потока вручную пользователем',
          },

          // ===========================
          // CONTEXT - EXPANDED
          // ===========================
          extract_files: {
            name: 'Извлечь файлы',
            description: 'Извлечь файлы из вложений карточки',
          },
          extract_text: {
            name: 'Извлечь текст',
            description: 'Извлечь текст из документов и изображений (OCR)',
          },
          extract_media: {
            name: 'Извлечь медиа',
            description: 'Извлечь изображения, видео и аудио из источников',
          },
          get_data: {
            name: 'Получить данные',
            description: 'Получить данные из любого источника',
          },
          rag_processing: {
            name: 'RAG обработка',
            description:
              'Обработка с использованием RAG (Retrieval Augmented Generation)',
          },
          transform_data: {
            name: 'Преобразовать данные',
            description: 'Преобразовать и отформатировать данные',
          },

          // ===========================
          // LOGIC - UNCHANGED
          // ===========================
          if_else: {
            name: 'ЕСЛИ/ИНАЧЕ',
            description: 'Условное ветвление на основе переменных',
          },
          switch: {
            name: 'Переключатель',
            description: 'Множественное ветвление условий',
          },
          loop: {
            name: 'Цикл',
            description: 'Повторить действия для каждого элемента',
          },

          // ===========================
          // ACTIONS - RENAMED & EXPANDED
          // ===========================
          comment: {
            name: 'Комментарий',
            description: 'Добавить комментарий к карточке',
          },
          ai_request: {
            name: 'AI запрос',
            description: 'Отправить запрос к AI модели',
          },
          generate_file: {
            name: 'Сгенерировать файл',
            description: 'Создать файл из шаблона и данных',
          },
          create_file: {
            name: 'Сгенерировать файл',
            description: 'Создать файл из шаблона и данных',
          },
          send_message: {
            name: 'Отправить сообщение',
            description:
              'Отправить сообщение через Email, SMS, Slack, Telegram',
          },
          send_notification: {
            name: 'Отправить сообщение',
            description:
              'Отправить сообщение через Email, SMS, Slack, Telegram',
          },
          api_call: {
            name: 'API запрос',
            description: 'Выполнить HTTP запрос к внешнему API',
          },
          mcp_operation: {
            name: 'MCP операция',
            description: 'Выполнить операцию через Model Context Protocol',
          },
          store_data: {
            name: 'Сохранить данные',
            description: 'Сохранить данные в базу данных или хранилище',
          },
          move_card: {
            name: 'Переместить карточку',
            description: 'Переместить карточку в другую колонку',
          },
          update_field: {
            name: 'Обновить поле',
            description: 'Обновить поле карточки',
          },

          // ===========================
          // WAIT - UNCHANGED
          // ===========================
          wait_response: {
            name: 'Ждать ответ',
            description: 'Ждать ответ от AI или внешней системы',
          },
          wait_timeout: {
            name: 'Ждать время',
            description: 'Ждать определенное время',
          },
          wait_condition: {
            name: 'Ждать условие',
            description: 'Ждать выполнения условия',
          },
        },
      },

      // Toolbar
      toolbar: {
        export: 'Экспорт',
        import: 'Импорт',
        settings: 'Настройки',
      },

      demo: {
        name: 'Анализ фотографий стрижки',
        description: 'Демо поток по требованиям тимлида',
      },

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
        title: 'Пример: Универсальный поток анализа фото',
        description:
          'Работает с ЛЮБОЙ системой досок - не только Jira! Ваш тимлид упомянул Jira как пример для тестирования.',
        flowLogic: 'Универсальная логика потока',
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
        flowTesting: 'Тестирование и развертывание потока',
      },

      // Fields
      fields: {
        board: 'Доска',
        column: 'Колонка',
        sourceColumn: 'Из колонки',
        targetColumn: 'В колонку',
        event: 'Событие',
        variable: 'Переменная',
        condition: 'Условие',
        value: 'Значение',
        source: 'Источник',
        types: 'Типы',
        waitFor: 'Ожидать',
        timeout: 'Таймаут',
        notSet: 'не задано',
        collection: 'Коллекция',
        itemVariable: 'Переменная элемента',
        maxIterations: 'Макс. итераций',
        collectionPlaceholder: 'Коллекция/Массив',
        itemVariablePlaceholder: 'Переменная элемента',
        maxIterationsPlaceholder: 'Максимум итераций',
        errorVariable: 'Переменная ошибки',
        errorType: 'Тип ошибки',
        aiModel: 'AI Модель',
        model: 'Модель',
        prompt: 'Промпт',
        file: 'Файл',
        format: 'Формат',
        recipient: 'Получатель',
        message: 'Сообщение',
        channel: 'Канал отправки',
        selectChannel: 'Выберите канал',
        fileName: 'Имя файла',
        fileContent: 'Содержимое файла',
        apiUrl: 'Адрес сервиса',
        method: 'Тип запроса',
        headers: 'Настройки подключения',
        body: 'Данные для отправки',
        headersPlaceholder: 'Например: {"Authorization": "Bearer token"}',
        bodyPlaceholder: 'Данные в формате JSON или текст',
        selectAiModel: 'Выберите AI модель',
        promptPlaceholder: 'Введите ваш промпт здесь...',
        commentText: 'Текст комментария',
        cardId: 'ID карточки',
        selectTargetColumn: 'Выберите целевую колонку',
        fieldName: 'Имя поля',
        newValue: 'Новое значение',
        duration: 'Длительность',
        unit: 'Единица времени',
        seconds: 'Секунды',
        minutes: 'Минуты',
        hours: 'Часы',
        timeoutSeconds: 'Таймаут (секунды)',
        waitCondition: 'Условие ожидания',
        variableNotEmpty: 'Переменная не пуста',
        variableEquals: 'Переменная равна значению',
        variableContains: 'Переменная содержит текст',
        apiSuccess: 'API вызов успешен',
        branches: 'Ветки',
        responseVariable: 'Переменная ответа',
        mcpServer: 'MCP Сервер',
        mcpOperation: 'Операция',
        mcpParams: 'Параметры',
        selectMcpServer: 'Выберите MCP сервер',
        selectOperation: 'Выберите операцию',
        paramsPlaceholder: 'Параметры в формате JSON',
        storageKey: 'Ключ хранилища',
        storageValue: 'Значение',
        storageKeyPlaceholder: 'Имя ключа для сохранения',
        storageValuePlaceholder: 'Данные для сохранения',
      },

      // Variable Storage Control
      variableStorage: {
        title: 'Сохранить результат в переменную',
        checkboxLabel: 'Сохранить вывод блока в переменную',
        variableNameLabel: 'Имя переменной',
        variableNamePlaceholder: 'например, извлеченный_текст, ответ_api',
        usageHint: 'Используйте',
        usageHintSuffix: 'в последующих блоках',
      },

      // Trigger Settings
      triggerSettings: {
        requireConfirmation: 'Требовать подтверждение перед выполнением',

        // Info labels
        type: 'Тип',
        expression: 'Выражение',
        timezone: 'Временная зона',
        source: 'Источник',
        event: 'Событие',
        boardType: 'Тип доски',

        // Schedule fields
        cronExpression: 'Cron выражение',
        interval: 'Интервал',
        once: 'Один раз',
        cronPlaceholder: 'например, */5 * * * *',
        intervalPlaceholder: 'например, 5m, 1h, 30s',
        timezonePlaceholder:
          'Временная зона (необязательно, например, UTC, Europe/Moscow)',

        // Event Listener fields
        boardEvents: 'События доски',
        userEvents: 'События пользователя',
        systemEvents: 'Системные события',
        customEvents: 'Пользовательские события',
        eventTypePlaceholder:
          'Тип события (например, card_moved, user_created)',
        boardTypePlaceholder:
          'Тип доски (необязательно, например, jira, trello)',

        // Manual Trigger fields
        allowedUsersPlaceholder: 'Разрешенные ID пользователей (через запятую)',
        allowedUsersLabel: 'Разрешенные пользователи',
        users: 'пользователей',
        confirmationLabel: 'Подтверждение',
        required: 'Требуется',
        notRequired: 'Не требуется',
      },

      // Events
      events: {
        card_moved: 'Карточка перемещена',
        card_created: 'Карточка создана',
        card_updated: 'Карточка обновлена',
        card_deleted: 'Карточка удалена',
        comment_added: 'Комментарий добавлен',
      },

      // States
      states: {
        success: 'Успех',
        error: 'Ошибка',
        timeout: 'Таймаут',
        true: 'Истина',
        false: 'Ложь',
        text: 'Текст',
        empty: 'Пусто',
      },

      launchBuilder: 'Запустить Builder (Скоро)',
      technicalNote: 'Техническая заметка',
      technicalStatus:
        'Все компоненты Конструктора потоков созданы и готовы. В данный момент решаем интеграцию React Flow TypeScript для визуального холста.',
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
      flowEditor: 'Flow Editor',
      flows: 'Flows',
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
        active: 'Active',
        inactive: 'Inactive',
        paused: 'Paused',
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

    // Flows page
    flows: {
      title: 'Flow Management',
      subtitle: 'Manage your automated workflows',
      createFlow: 'Create Flow',
      noFlows: 'You have no flows yet',
      noFlowsDescription: 'Create your first flow to automate processes',

      // Loading and error states
      loading: 'Loading flows...',
      errorTitle: 'Error loading flows',
      loadingError: 'Failed to load flows',

      // Stats
      stats: {
        totalFlows: 'Total Flows',
        activeFlows: 'Active',
        drafts: 'Drafts',
        avgBlocks: 'Avg Blocks',
        blocks: 'blocks',
      },

      // Flow details
      noDescription: 'No description',
      created: 'Created',
      updated: 'Updated',
      createdBy: 'Created by',

      // Flow statuses
      status: {
        draft: 'Draft',
        active: 'Active',
        archived: 'Archived',
      },

      // Flow actions
      actions: {
        execute: 'Execute',
        clone: 'Clone',
        edit: 'Edit',
        delete: 'Delete',
        deploy: 'Deploy to Agent',
        view: 'View',
        refresh: 'Refresh',
      },

      // Search and filters
      search: {
        placeholder: 'Search flows...',
        status: 'Status',
        all: 'All',
      },

      // Execution messages
      execution: {
        started: 'execution started!',
        failed: 'Failed to execute flow:',
      },

      // Clone messages
      clone: {
        success: 'cloned successfully!',
        failed: 'Failed to clone flow:',
      },

      // Delete messages
      delete: {
        confirm: 'Are you sure you want to delete this flow?',
        success: 'deleted successfully!',
        failed: 'Failed to delete flow:',
      },

      // Deploy messages
      deploy: {
        success: 'Flow successfully deployed to Agent',
        failed: 'Failed to deploy flow to Agent:',
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
      title: 'AI Flow Builder',
      subtitle: 'Create AI agents using visual constructor',
      createDemo: 'Create Demo',
      test: 'Test',
      save: 'Save',
      cancel: 'Cancel',
      editMode: 'Editing',

      // Block Palette
      blockPalette: {
        title: 'Block Palette',
        subtitle: 'Drag blocks to canvas to build your flow',
        categories: {
          trigger: 'Triggers',
          context: 'Context',
          logic: 'Logic',
          action: 'Actions',
          wait: 'Wait',
        },
        blocks: {
          // ===========================
          // TRIGGERS - UNIVERSAL
          // ===========================
          board_move: {
            name: 'Card Moved',
            description: 'Triggered when a card is moved between columns',
          },
          board_create: {
            name: 'Card Created',
            description: 'Triggered when a new card is created',
          },
          webhook: {
            name: 'Webhook',
            description: 'Triggered by external webhook from any system',
          },
          schedule: {
            name: 'Schedule',
            description: 'Triggered at specific times or intervals',
          },
          event_listener: {
            name: 'Event Listener',
            description: 'Universal trigger for any system events',
          },
          manual_trigger: {
            name: 'Manual Trigger',
            description: 'Manually start flow execution',
          },

          // ===========================
          // CONTEXT - EXPANDED
          // ===========================
          extract_files: {
            name: 'Extract Files',
            description: 'Extract files from card attachments',
          },
          extract_text: {
            name: 'Extract Text',
            description: 'Extract text from documents and images (OCR)',
          },
          extract_media: {
            name: 'Extract Media',
            description: 'Extract images, videos and audio from sources',
          },
          get_data: {
            name: 'Get Data',
            description: 'Get data from any source',
          },
          rag_processing: {
            name: 'RAG Processing',
            description: 'Process using RAG (Retrieval Augmented Generation)',
          },
          transform_data: {
            name: 'Transform Data',
            description: 'Transform and format data',
          },

          // ===========================
          // LOGIC - UNCHANGED
          // ===========================
          if_else: {
            name: 'IF/ELSE',
            description: 'Conditional branching based on variables',
          },
          switch: {
            name: 'Switch',
            description: 'Multiple condition branching',
          },
          loop: {
            name: 'Loop',
            description: 'Repeat actions for each item',
          },

          // ===========================
          // ACTIONS - RENAMED & EXPANDED
          // ===========================
          comment: {
            name: 'Comment',
            description: 'Add comment to card',
          },
          ai_request: {
            name: 'AI Request',
            description: 'Send request to AI model',
          },
          generate_file: {
            name: 'Generate File',
            description: 'Create file from template and data',
          },
          create_file: {
            name: 'Generate File',
            description: 'Create file from template and data',
          },
          send_message: {
            name: 'Send Message',
            description: 'Send message via Email, SMS, Slack, Telegram',
          },
          send_notification: {
            name: 'Send Message',
            description: 'Send message via Email, SMS, Slack, Telegram',
          },
          api_call: {
            name: 'API Call',
            description: 'Execute HTTP request to external API',
          },
          mcp_operation: {
            name: 'MCP Operation',
            description: 'Execute operation via Model Context Protocol',
          },
          store_data: {
            name: 'Store Data',
            description: 'Store data in database or storage',
          },
          move_card: {
            name: 'Move Card',
            description: 'Move card to another column',
          },
          update_field: {
            name: 'Update Field',
            description: 'Update card field',
          },

          // ===========================
          // WAIT - UNCHANGED
          // ===========================
          wait_response: {
            name: 'Wait Response',
            description: 'Wait for AI or external system response',
          },
          wait_timeout: {
            name: 'Wait Timeout',
            description: 'Wait for specific time',
          },
          wait_condition: {
            name: 'Wait Condition',
            description: 'Wait for condition to be met',
          },
        },
      },

      // Toolbar
      toolbar: {
        export: 'Export',
        import: 'Import',
        settings: 'Settings',
      },

      demo: {
        name: 'Hair Cut Photo Analysis',
        description: 'Demo flow based on team lead requirements',
      },

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

      // Fields
      fields: {
        board: 'Board',
        column: 'Column',
        sourceColumn: 'From Column',
        targetColumn: 'To Column',
        event: 'Event',
        variable: 'Variable',
        condition: 'Condition',
        value: 'Value',
        source: 'Source',
        types: 'Types',
        waitFor: 'Wait for',
        timeout: 'Timeout',
        notSet: 'not set',
        collection: 'Collection',
        itemVariable: 'Item Variable',
        maxIterations: 'Max Iterations',
        collectionPlaceholder: 'Collection/Array',
        itemVariablePlaceholder: 'Item Variable',
        maxIterationsPlaceholder: 'Max Iterations',
        errorVariable: 'Error Variable',
        errorType: 'Error Type',
        aiModel: 'AI Model',
        model: 'Model',
        prompt: 'Prompt',
        file: 'File',
        format: 'Format',
        recipient: 'To',
        message: 'Message',
        channel: 'Channel',
        selectChannel: 'Select Channel',
        fileName: 'File Name',
        fileContent: 'File Content',
        apiUrl: 'Service Address',
        method: 'Request Type',
        headers: 'Connection Settings',
        body: 'Data to Send',
        headersPlaceholder: 'Example: {"Authorization": "Bearer token"}',
        bodyPlaceholder: 'JSON data or text content',
        selectAiModel: 'Select AI Model',
        promptPlaceholder: 'Enter your prompt here...',
        commentText: 'Comment Text',
        cardId: 'Card ID',
        selectTargetColumn: 'Select Target Column',
        fieldName: 'Field Name',
        newValue: 'New Value',
        duration: 'Duration',
        unit: 'Time Unit',
        seconds: 'Seconds',
        minutes: 'Minutes',
        hours: 'Hours',
        timeoutSeconds: 'Timeout (seconds)',
        waitCondition: 'Wait Condition',
        variableNotEmpty: 'Variable is not empty',
        variableEquals: 'Variable equals value',
        variableContains: 'Variable contains text',
        apiSuccess: 'API call succeeds',
        branches: 'Branches',
        responseVariable: 'Response Variable',
        mcpServer: 'MCP Server',
        mcpOperation: 'Operation',
        mcpParams: 'Parameters',
        selectMcpServer: 'Select MCP Server',
        selectOperation: 'Select Operation',
        paramsPlaceholder: 'Parameters in JSON format',
        storageKey: 'Storage Key',
        storageValue: 'Value',
        storageKeyPlaceholder: 'Key name to store',
        storageValuePlaceholder: 'Data to store',
      },

      // Variable Storage Control
      variableStorage: {
        title: 'Save Result to Variable',
        checkboxLabel: 'Store block output in a variable',
        variableNameLabel: 'Variable Name',
        variableNamePlaceholder: 'e.g., extracted_text, api_response',
        usageHint: 'Use',
        usageHintSuffix: 'in subsequent blocks',
      },

      // Trigger Settings
      triggerSettings: {
        requireConfirmation: 'Require confirmation before execution',

        // Info labels
        type: 'Type',
        expression: 'Expression',
        timezone: 'Timezone',
        source: 'Source',
        event: 'Event',
        boardType: 'Board Type',

        // Schedule fields
        cronExpression: 'Cron Expression',
        interval: 'Interval',
        once: 'Once',
        cronPlaceholder: 'e.g., */5 * * * *',
        intervalPlaceholder: 'e.g., 5m, 1h, 30s',
        timezonePlaceholder: 'Timezone (optional, e.g., UTC, America/New_York)',

        // Event Listener fields
        boardEvents: 'Board Events',
        userEvents: 'User Events',
        systemEvents: 'System Events',
        customEvents: 'Custom Events',
        eventTypePlaceholder: 'Event Type (e.g., card_moved, user_created)',
        boardTypePlaceholder: 'Board Type (optional, e.g., jira, trello)',

        // Manual Trigger fields
        allowedUsersPlaceholder: 'Allowed User IDs (comma-separated)',
        allowedUsersLabel: 'Allowed Users',
        users: 'users',
        confirmationLabel: 'Confirmation',
        required: 'Required',
        notRequired: 'Not Required',
      },

      // Events
      events: {
        card_moved: 'Card Moved',
        card_created: 'Card Created',
        card_updated: 'Card Updated',
        card_deleted: 'Card Deleted',
        comment_added: 'Comment Added',
      },

      // States
      states: {
        success: 'Success',
        error: 'Error',
        timeout: 'Timeout',
        true: 'True',
        false: 'False',
        text: 'Text',
        empty: 'Empty',
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
