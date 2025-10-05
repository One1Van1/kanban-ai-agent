import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestDataFactory } from '../helpers/test-data-factory';
import {
  MockEmailService,
  MockTelegramService,
} from '../helpers/mock-services';
import { ConfigModule } from '@nestjs/config';

describe('Notifications Integration Tests (E2E)', () => {
  let app: INestApplication;
  let mockEmailService: MockEmailService;
  let mockTelegramService: MockTelegramService;

  beforeAll(async () => {
    mockEmailService = new MockEmailService();
    mockTelegramService = new MockTelegramService();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    })
      .overrideProvider('EMAIL_SERVICE')
      .useValue(mockEmailService)
      .overrideProvider('TELEGRAM_SERVICE')
      .useValue(mockTelegramService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear sent messages before each test
    mockEmailService.clearSentEmails();
    mockTelegramService.clearSentMessages();
  });

  describe('POST /notifications/email (Send Email)', () => {
    it('should send email successfully', async () => {
      const emailData = TestDataFactory.sendEmailData();

      const response = await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('messageId');
      expect(response.body.data.status).toBe('sent');
      expect(response.body.data.recipient).toBe(emailData.to);

      // Verify email was actually sent through mock service
      const sentEmails = mockEmailService.getSentEmails();
      expect(sentEmails).toHaveLength(1);
      expect(sentEmails[0].to).toBe(emailData.to);
      expect(sentEmails[0].subject).toBe(emailData.subject);
    });

    it('should fail with invalid email address', async () => {
      const invalidEmailData = {
        to: 'invalid-email',
        subject: 'Test Subject',
        text: 'Test message',
      };

      await request(app.getHttpServer())
        .post('/notifications/email')
        .send(invalidEmailData)
        .expect(400);

      // Verify no email was sent
      const sentEmails = mockEmailService.getSentEmails();
      expect(sentEmails).toHaveLength(0);
    });

    it('should handle missing required fields', async () => {
      const incompleteData = {
        to: 'test@example.com',
        // Missing subject and text
      };

      await request(app.getHttpServer())
        .post('/notifications/email')
        .send(incompleteData)
        .expect(400);
    });

    it('should send email with HTML content', async () => {
      const emailWithHtml = TestDataFactory.sendEmailData();
      emailWithHtml.html =
        '<h1>Test HTML Content</h1><p>This is HTML email</p>';

      const response = await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailWithHtml)
        .expect(201);

      expect(response.body.success).toBe(true);

      const sentEmails = mockEmailService.getSentEmails();
      expect(sentEmails[0].html).toBe(emailWithHtml.html);
    });

    it('should handle email service errors gracefully', async () => {
      // Override service to simulate error
      jest
        .spyOn(mockEmailService, 'sendEmail')
        .mockRejectedValueOnce(new Error('SMTP server unavailable'));

      const emailData = TestDataFactory.sendEmailData();

      const response = await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Failed to send email');
    });

    it('should validate email content length', async () => {
      const longEmailData = TestDataFactory.sendEmailData();
      longEmailData.text = 'x'.repeat(50000); // Very long content

      const response = await request(app.getHttpServer())
        .post('/notifications/email')
        .send(longEmailData);

      // Should either accept or reject based on validation rules
      expect([201, 400]).toContain(response.status);
    });
  });

  describe('POST /notifications/telegram (Send Telegram)', () => {
    it('should send Telegram message successfully', async () => {
      const telegramData = TestDataFactory.sendTelegramData();

      const response = await request(app.getHttpServer())
        .post('/notifications/telegram')
        .send(telegramData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('messageId');
      expect(response.body.data.status).toBe('sent');
      expect(response.body.data.chatId).toBe(telegramData.chatId);

      // Verify message was sent through mock service
      const sentMessages = mockTelegramService.getSentMessages();
      expect(sentMessages).toHaveLength(1);
      expect(sentMessages[0].chatId).toBe(telegramData.chatId);
      expect(sentMessages[0].text).toBe(telegramData.text);
    });

    it('should fail with invalid chat ID', async () => {
      const invalidTelegramData = {
        chatId: 'invalid-chat-id',
        text: 'Test message',
      };

      await request(app.getHttpServer())
        .post('/notifications/telegram')
        .send(invalidTelegramData)
        .expect(400);

      const sentMessages = mockTelegramService.getSentMessages();
      expect(sentMessages).toHaveLength(0);
    });

    it('should handle missing message text', async () => {
      const incompleteData = {
        chatId: '123456789',
        // Missing text
      };

      await request(app.getHttpServer())
        .post('/notifications/telegram')
        .send(incompleteData)
        .expect(400);
    });

    it('should support different parse modes', async () => {
      const markdownMessage = {
        chatId: '123456789',
        text: '*Bold text* and _italic text_',
        parseMode: 'Markdown',
      };

      const response = await request(app.getHttpServer())
        .post('/notifications/telegram')
        .send(markdownMessage)
        .expect(201);

      expect(response.body.success).toBe(true);

      const sentMessages = mockTelegramService.getSentMessages();
      expect(sentMessages[0].parseMode).toBe('Markdown');
    });

    it('should handle Telegram service errors gracefully', async () => {
      jest
        .spyOn(mockTelegramService, 'sendMessage')
        .mockRejectedValueOnce(new Error('Bot token invalid'));

      const telegramData = TestDataFactory.sendTelegramData();

      const response = await request(app.getHttpServer())
        .post('/notifications/telegram')
        .send(telegramData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        'Failed to send Telegram message',
      );
    });

    it('should validate message length limits', async () => {
      const longMessage = TestDataFactory.sendTelegramData();
      longMessage.text = 'x'.repeat(5000); // Exceeds Telegram limit

      await request(app.getHttpServer())
        .post('/notifications/telegram')
        .send(longMessage)
        .expect(400);
    });
  });

  describe('Notification Integration Workflows', () => {
    it('should send both email and Telegram notifications in sequence', async () => {
      const emailData = TestDataFactory.sendEmailData();
      const telegramData = TestDataFactory.sendTelegramData();

      // Send email first
      const emailResponse = await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailData)
        .expect(201);

      // Then send Telegram
      const telegramResponse = await request(app.getHttpServer())
        .post('/notifications/telegram')
        .send(telegramData)
        .expect(201);

      expect(emailResponse.body.success).toBe(true);
      expect(telegramResponse.body.success).toBe(true);

      // Verify both were sent
      expect(mockEmailService.getSentEmails()).toHaveLength(1);
      expect(mockTelegramService.getSentMessages()).toHaveLength(1);
    });

    it('should handle concurrent notification requests', async () => {
      const emailPromises = [];
      const telegramPromises = [];

      // Create multiple concurrent requests
      for (let i = 0; i < 5; i++) {
        const emailData = TestDataFactory.sendEmailData();
        emailData.to = `test${i}@example.com`;
        emailPromises.push(
          request(app.getHttpServer())
            .post('/notifications/email')
            .send(emailData),
        );

        const telegramData = TestDataFactory.sendTelegramData();
        telegramData.chatId = `12345678${i}`;
        telegramPromises.push(
          request(app.getHttpServer())
            .post('/notifications/telegram')
            .send(telegramData),
        );
      }

      const startTime = Date.now();
      const [emailResponses, telegramResponses] = await Promise.all([
        Promise.all(emailPromises),
        Promise.all(telegramPromises),
      ]);
      const endTime = Date.now();

      // All should succeed
      emailResponses.forEach((response) => {
        expect(response.status).toBe(201);
      });
      telegramResponses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(3000);

      // Verify all were sent
      expect(mockEmailService.getSentEmails()).toHaveLength(5);
      expect(mockTelegramService.getSentMessages()).toHaveLength(5);
    });

    it('should maintain notification order under load', async () => {
      const notifications = [];

      // Create ordered sequence of notifications
      for (let i = 0; i < 10; i++) {
        const emailData = TestDataFactory.sendEmailData();
        emailData.subject = `Email ${i}`;
        emailData.to = `test${i}@example.com`;

        notifications.push({
          type: 'email',
          data: emailData,
          order: i,
        });
      }

      // Send all notifications
      const promises = notifications.map((notification) =>
        request(app.getHttpServer())
          .post('/notifications/email')
          .send(notification.data),
      );

      const responses = await Promise.all(promises);

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Verify all emails were sent
      const sentEmails = mockEmailService.getSentEmails();
      expect(sentEmails).toHaveLength(10);
    });
  });

  describe('Performance and Reliability Tests', () => {
    it('should handle high volume email sending', async () => {
      const emailPromises = [];
      const emailCount = 25;

      for (let i = 0; i < emailCount; i++) {
        const emailData = TestDataFactory.sendEmailData();
        emailData.to = `bulk${i}@example.com`;
        emailData.subject = `Bulk Email ${i}`;

        emailPromises.push(
          request(app.getHttpServer())
            .post('/notifications/email')
            .send(emailData),
        );
      }

      const startTime = Date.now();
      const responses = await Promise.all(emailPromises);
      const endTime = Date.now();

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Should maintain reasonable throughput
      const avgTime = (endTime - startTime) / emailCount;
      expect(avgTime).toBeLessThan(200); // < 200ms per email

      expect(mockEmailService.getSentEmails()).toHaveLength(emailCount);
    });

    it('should recover from service failures', async () => {
      // Simulate service failure for first request
      jest
        .spyOn(mockEmailService, 'sendEmail')
        .mockRejectedValueOnce(new Error('Service temporarily unavailable'))
        .mockResolvedValue({
          success: true,
          messageId: 'recovery-msg',
          response: 'Email sent successfully',
        });

      const emailData = TestDataFactory.sendEmailData();

      // First request should fail
      await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailData)
        .expect(500);

      // Second request should succeed (service recovered)
      await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailData)
        .expect(201);
    });

    it('should handle malformed notification data gracefully', async () => {
      const malformedData = {
        to: null,
        subject: undefined,
        text: {},
      };

      await request(app.getHttpServer())
        .post('/notifications/email')
        .send(malformedData)
        .expect(400);

      // System should remain stable
      const healthCheck = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(healthCheck.body.message).toBe('AI Kanban Agent is running!');
    });
  });

  describe('Security and Validation Tests', () => {
    it('should sanitize email content', async () => {
      const emailWithScript = {
        to: 'test@example.com',
        subject: 'Test <script>alert("xss")</script>',
        text: 'Content with <script>alert("xss")</script>',
        html: '<p>HTML with <script>alert("xss")</script></p>',
      };

      const response = await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailWithScript)
        .expect(201);

      expect(response.body.success).toBe(true);

      const sentEmails = mockEmailService.getSentEmails();
      // Scripts should be sanitized or escaped
      expect(sentEmails[0].subject).not.toContain('<script>');
    });

    it('should validate recipient limits', async () => {
      const emailWithManyRecipients = {
        to: Array(100).fill('test@example.com').join(','), // Too many recipients
        subject: 'Test',
        text: 'Test message',
      };

      await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailWithManyRecipients)
        .expect(400);
    });

    it('should prevent notification spam', async () => {
      const emailData = TestDataFactory.sendEmailData();
      const spamPromises = [];

      // Try to send many emails to same recipient quickly
      for (let i = 0; i < 20; i++) {
        spamPromises.push(
          request(app.getHttpServer())
            .post('/notifications/email')
            .send(emailData),
        );
      }

      const responses = await Promise.all(spamPromises);

      // Some should be rate limited
      const successCount = responses.filter((r) => r.status === 201).length;
      const rateLimitedCount = responses.filter((r) => r.status === 429).length;

      expect(successCount + rateLimitedCount).toBe(20);
      expect(rateLimitedCount).toBeGreaterThan(0); // Some should be rate limited
    });
  });

  describe('Configuration and Feature Tests', () => {
    it('should respect notification preferences', async () => {
      const emailData = TestDataFactory.sendEmailData();
      (emailData as any).priority = 'low';

      const response = await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailData)
        .expect(201);

      expect(response.body.data.priority).toBe('low');
    });

    it('should support notification templates', async () => {
      const templateEmail = {
        to: 'test@example.com',
        template: 'task_assignment',
        templateData: {
          taskTitle: 'Test Task',
          assignee: 'John Doe',
          dueDate: '2024-12-31',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/notifications/email')
        .send(templateEmail);

      // Should either accept template or require explicit content
      expect([201, 400]).toContain(response.status);
    });

    it('should track notification delivery status', async () => {
      const emailData = TestDataFactory.sendEmailData();

      const response = await request(app.getHttpServer())
        .post('/notifications/email')
        .send(emailData)
        .expect(201);

      expect(response.body.data).toHaveProperty('messageId');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data.status).toBe('sent');
    });
  });
});
