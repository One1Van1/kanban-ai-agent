# Execute Haircut Tasks API

## Описание

Эндпойнт для выполнения задач о парикмахерских услугах с помощью AI агента.

## Endpoint

```
POST /ai-agent/execute-haircut-tasks
```

## Описание функциональности

AI агент выполняет задачи о стрижках из колонки "In Progress", автоматически:

- Анализирует фото клиента и референсы
- Создаёт план стрижки
- Генерирует инструкции для мастера
- Рассчитывает время и стоимость
- Добавляет результат в задачу

Специализированный AI для парикмахерской индустрии с компьютерным зрением.

## Параметры запроса

### Request Body

```json
{
  "masterLevel": "senior",
  "includeTimeEstimation": true,
  "generateInstructions": true,
  "analyzeComplexity": true,
  "createPricing": true
}
```

| Поле                  | Тип     | Обязательный | Описание                                      | По умолчанию |
| --------------------- | ------- | ------------ | --------------------------------------------- | ------------ |
| masterLevel           | string  | Нет          | Уровень мастера (junior, middle, senior, top) | "middle"     |
| includeTimeEstimation | boolean | Нет          | Включить оценку времени                       | true         |
| generateInstructions  | boolean | Нет          | Генерировать инструкции для мастера           | true         |
| analyzeComplexity     | boolean | Нет          | Анализировать сложность работы                | true         |
| createPricing         | boolean | Нет          | Рассчитывать стоимость                        | true         |

## Пример запроса

```bash
curl -X POST http://localhost:3000/ai-agent/execute-haircut-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "masterLevel": "senior",
    "includeTimeEstimation": true,
    "generateInstructions": true,
    "analyzeComplexity": true,
    "createPricing": true
  }'
```

## Ответы

### Успешный ответ (200)

```json
{
  "tasksExecuted": 2,
  "successfulExecutions": 2,
  "results": [
    {
      "taskKey": "KAN-30",
      "executed": true,
      "success": true,
      "serviceType": "женская стрижка каре",
      "complexity": "medium",
      "analysis": {
        "hairType": "тонкие прямые волосы",
        "faceShape": "овальное",
        "currentLength": "до плеч",
        "desiredLength": "до подбородка",
        "recommendations": [
          "градуированное каре для объёма",
          "филировка кончиков",
          "лёгкие слои у лица"
        ]
      },
      "execution": {
        "technique": "градуировка + текстурирование",
        "tools": ["ножницы", "филировочные ножницы", "расчёска"],
        "steps": [
          "Разделить волосы на зоны",
          "Создать базовую длину",
          "Добавить градуировку",
          "Выполнить текстурирование"
        ],
        "estimatedTime": 75,
        "difficulty": "medium"
      },
      "pricing": {
        "basePrice": 2500,
        "masterSurcharge": 500,
        "totalPrice": 3000,
        "currency": "RUB"
      },
      "masterInstructions": "Выполнить градуированное каре с текстурированием. Особое внимание к объёму в корневой зоне. Филировка обязательна для создания естественного движения волос.",
      "imageAnalysis": {
        "referenceImageProcessed": true,
        "clientPhotoProcessed": true,
        "confidenceScore": 0.94
      }
    },
    {
      "taskKey": "KAN-31",
      "executed": true,
      "success": true,
      "serviceType": "мужская стрижка фейд",
      "complexity": "high",
      "analysis": {
        "hairType": "жёсткие волнистые волосы",
        "faceShape": "квадратное",
        "currentLength": "средняя",
        "desiredStyle": "low fade + textured top",
        "recommendations": [
          "low fade с переходом от 1 до 4",
          "текстурированный верх",
          "лёгкий объём в макушечной зоне"
        ]
      },
      "execution": {
        "technique": "машинная стрижка + ножницы",
        "tools": ["машинка", "ножницы", "филировочные ножницы", "расчёска"],
        "steps": [
          "Создать базовый fade",
          "Растушевать переходы",
          "Текстурировать верхнюю часть",
          "Финальная коррекция"
        ],
        "estimatedTime": 45,
        "difficulty": "high"
      },
      "pricing": {
        "basePrice": 1800,
        "complexitySurcharge": 300,
        "totalPrice": 2100,
        "currency": "RUB"
      },
      "masterInstructions": "Точная работа с машинкой для создания плавного fade. Верх текстурировать для естественного движения. Особое внимание к височным зонам.",
      "imageAnalysis": {
        "referenceImageProcessed": true,
        "clientPhotoProcessed": true,
        "confidenceScore": 0.89
      }
    }
  ],
  "timestamp": "2025-09-23T15:04:11.000Z",
  "duration": 3200,
  "summary": {
    "averageComplexity": "medium-high",
    "totalEstimatedTime": 120,
    "totalRevenue": 5100,
    "aiConfidenceAverage": 0.915
  }
}
```

### Структура ответа

| Поле                 | Тип    | Описание                         |
| -------------------- | ------ | -------------------------------- |
| tasksExecuted        | number | Количество выполненных задач     |
| successfulExecutions | number | Количество успешных выполнений   |
| results              | array  | Массив результатов выполнения    |
| timestamp            | string | Временная метка выполнения       |
| duration             | number | Время выполнения в миллисекундах |
| summary              | object | Сводная информация               |

### Структура объекта result

| Поле               | Тип     | Описание                       |
| ------------------ | ------- | ------------------------------ |
| taskKey            | string  | Ключ задачи                    |
| executed           | boolean | Была ли выполнена              |
| success            | boolean | Успешность выполнения          |
| serviceType        | string  | Тип услуги                     |
| complexity         | string  | Сложность работы               |
| analysis           | object  | Анализ исходных данных         |
| execution          | object  | План выполнения                |
| pricing            | object  | Расчёт стоимости               |
| masterInstructions | string  | Инструкции для мастера         |
| imageAnalysis      | object  | Результаты анализа изображений |

## Возможные ошибки

- **400 Bad Request** - Некорректные параметры
- **500 Internal Server Error** - Ошибка при выполнении задач
- **503 Service Unavailable** - AI сервис недоступен

## Анализ изображений с помощью Computer Vision

### Обработка фото клиента

```javascript
const clientPhotoAnalysis = {
  faceShape: 'oval', // oval, round, square, heart, diamond
  hairType: 'fine_straight', // thick, fine, curly, wavy, straight
  hairLength: 'shoulder_length',
  hairColor: 'dark_brown',
  skinTone: 'warm', // warm, cool, neutral
  facialFeatures: {
    jawline: 'soft',
    cheekbones: 'prominent',
    forehead: 'medium',
  },
};
```

### Анализ референсных изображений

```javascript
const referenceAnalysis = {
  haircutStyle: 'graduated_bob',
  length: 'chin_length',
  layers: true,
  texture: 'smooth',
  volume: 'medium',
  maintenance: 'medium', // low, medium, high
  suitability: {
    faceShapes: ['oval', 'heart', 'square'],
    hairTypes: ['fine', 'medium', 'straight', 'wavy'],
    ageGroups: ['20-30', '30-40', '40-50'],
  },
};
```

## Алгоритмы AI для стрижек

### Подбор стрижки по форме лица

```javascript
const faceShapeRecommendations = {
  oval: {
    suitable: ['любые стрижки', 'эксперименты приветствуются'],
    avoid: ['слишком длинные прямые волосы'],
  },
  round: {
    suitable: ['асимметрия', 'объём на макушке', 'длинные слои'],
    avoid: ['прямое каре', 'объём по бокам'],
  },
  square: {
    suitable: ['мягкие волны', 'слои', 'удлинённое каре'],
    avoid: ['прямые срезы', 'короткие стрижки'],
  },
  heart: {
    suitable: ['объём в нижней части', 'каре', 'локоны'],
    avoid: ['короткие стрижки', 'объём на макушке'],
  },
};
```

### Техники выполнения стрижек

```javascript
const cuttingTechniques = {
  bluntCut: {
    description: 'Ровный срез',
    tools: ['острые ножницы'],
    difficulty: 'easy',
    effect: 'чёткие линии, плотность',
  },
  layering: {
    description: 'Слоистая стрижка',
    tools: ['ножницы', 'расчёска'],
    difficulty: 'medium',
    effect: 'объём, движение',
  },
  graduation: {
    description: 'Градуировка',
    tools: ['ножницы', 'расчёска'],
    difficulty: 'high',
    effect: 'объём, форма',
  },
  texturizing: {
    description: 'Текстурирование',
    tools: ['филировочные ножницы'],
    difficulty: 'medium',
    effect: 'естественность, лёгкость',
  },
};
```

## Расчёт стоимости услуг

### Базовые тарифы

```javascript
const basePricing = {
  // Женские стрижки
  'женская стрижка простая': 2000,
  'женская стрижка средней сложности': 2500,
  'женская стрижка сложная': 3500,

  // Мужские стрижки
  'мужская стрижка стандартная': 1500,
  'мужская стрижка fade': 2000,
  'мужская стрижка креативная': 2500,

  // Детские стрижки
  'детская стрижка': 1200,

  // Специальные услуги
  'моделирование бороды': 800,
  укладка: 1000,
};
```

### Коэффициенты наценки

```javascript
const surcharges = {
  masterLevel: {
    junior: 1.0,
    middle: 1.2,
    senior: 1.5,
    top: 2.0,
  },
  complexity: {
    simple: 1.0,
    medium: 1.2,
    high: 1.5,
    expert: 2.0,
  },
  timeOfDay: {
    morning: 1.0,
    afternoon: 1.1,
    evening: 1.2,
    weekend: 1.3,
  },
};
```

## Генерация инструкций для мастера

### Пошаговые инструкции

```javascript
const generateInstructions = (analysis, execution) => {
  return {
    preparation: [
      'Консультация с клиентом',
      'Анализ структуры волос',
      'Определение направления роста',
      'Выбор техники выполнения',
    ],
    execution: execution.steps,
    finishing: [
      'Контрольная проверка симметрии',
      'Финальная коррекция',
      'Укладка',
      'Демонстрация результата клиенту',
    ],
    aftercare: [
      'Рекомендации по уходу',
      'Периодичность коррекции',
      'Подходящие средства для укладки',
    ],
  };
};
```

### Специальные рекомендации

```javascript
const specialRecommendations = {
  thinHair: 'Избегать слишком короткой филировки',
  thickHair: 'Обязательна филировка для снятия массы',
  curlyHair: 'Стричь только на влажные волосы',
  greyHair: 'Использовать специальные техники для маскировки',
  damagedHair: 'Минимальное воздействие, восстанавливающий уход',
};
```

## Контроль качества

### Проверка результата

```javascript
const qualityChecks = [
  'симметрия стрижки',
  'плавность переходов',
  'соответствие референсу',
  'учёт особенностей лица',
  'качество укладки',
  'общая гармоничность образа',
];
```

### Фото "до" и "после"

- Автоматическое создание галереи
- Сравнение с планом стрижки
- Анализ качества выполнения
- Добавление в портфолио мастера

## Обратная связь и обучение

### Система рейтингов

```javascript
const feedbackSystem = {
  clientSatisfaction: 'Оценка клиента 1-5',
  masterDifficulty: 'Сложность выполнения по мнению мастера',
  timeAccuracy: 'Точность оценки времени',
  priceJustification: 'Соответствие цены сложности',
};
```

### Машинное обучение

- Анализ успешных стрижек
- Корректировка алгоритмов
- Улучшение точности рекомендаций
- Обновление базы знаний

## Интеграция с салоном

### Календарь и запись

- Автоматическое бронирование времени
- Уведомления клиентам
- Подтверждение записи
- Напоминания о визите

### Учёт материалов

- Расчёт расхода косметики
- Заказ необходимых средств
- Контроль остатков
- Планирование закупок

### CRM интеграция

- История клиента
- Предпочтения и особенности
- Фото предыдущих работ
- Персональные скидки

## Аналитика и отчёты

### Статистика выполнения

- Популярные типы стрижек
- Эффективность мастеров
- Точность AI предсказаний
- Доходность услуг

### Тренды и прогнозы

- Сезонные предпочтения
- Возрастные группы
- Цветовые тренды
- Новые техники

## Теги Swagger

- **ai-agent** - Эндпойнты AI агента
