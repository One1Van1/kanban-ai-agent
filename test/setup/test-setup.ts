import { ConfigService } from '@nestjs/config';

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_USERNAME = 'test_user';
  process.env.DB_PASSWORD = 'test_password';
  process.env.DB_DATABASE = 'kanban_test';
  process.env.REDIS_HOST = 'localhost';
  process.env.REDIS_PORT = '6379';
  process.env.REDIS_DB = '1';
  process.env.JIRA_BASE_URL = 'https://test.atlassian.net';
  process.env.JIRA_USERNAME = 'test@example.com';
  process.env.JIRA_API_TOKEN = 'test-token';
  process.env.CLAUDE_API_KEY = 'test-claude-key';
  process.env.EMAIL_HOST = 'smtp.test.com';
  process.env.EMAIL_PORT = '587';
  process.env.EMAIL_USER = 'test@example.com';
  process.env.EMAIL_PASS = 'test-password';
  process.env.TELEGRAM_BOT_TOKEN = 'test-telegram-token';
  process.env.BULL_REDIS_HOST = 'localhost';
  process.env.BULL_REDIS_PORT = '6379';

  console.log('🧪 Test environment initialized');
});

// Global test teardown
afterAll(async () => {
  console.log('🧹 Test environment cleanup completed');
});

// Global error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Jest configuration extensions
jest.setTimeout(30000);

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUUID(): R;
      toBeISODateString(): R;
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidUUID(received: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const pass = typeof received === 'string' && uuidRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },

  toBeISODateString(received: string) {
    const pass = typeof received === 'string' && !isNaN(Date.parse(received));

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid ISO date string`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid ISO date string`,
        pass: false,
      };
    }
  },
});

export {};
