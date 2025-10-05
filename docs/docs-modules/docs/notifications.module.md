# notifications.module.ts

## Описание

Модуль системы уведомлений. Обеспечивает отправку уведомлений через различные каналы связи.

## Контроллеры

- **SendEmailController** - отправка email уведомлений
- **SendTelegramController** - отправка telegram сообщений

## Сервисы

- **SendEmailService** - логика отправки email через SMTP
- **SendTelegramService** - логика отправки через Telegram Bot API

## Конфигурация

Использует `notifications.config.ts` для настройки SMTP и Telegram параметров.

## Зависимости

- **nodemailer** - для отправки email
- **telegraf** - для работы с Telegram Bot API

## API Endpoints

- `POST /notifications/email` - отправить email
- `POST /notifications/telegram` - отправить telegram сообщение
