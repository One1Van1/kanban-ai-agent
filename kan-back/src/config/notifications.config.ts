import { registerAs } from '@nestjs/config';

export default registerAs('notifications', () => ({
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    from: process.env.SMTP_FROM || 'noreply@kanban-ai.com',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    defaultChatId: process.env.TELEGRAM_DEFAULT_CHAT_ID,
  },
}));
