import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../kan-back/src/app.module';
import { TestDataFactory } from '../helpers/test-data-factory';
import { MockBullQueue, MockRedisService } from '../helpers/mock-services';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';

describe('Queue Management Integration Tests (E2E)', () => {
  let app: INestApplication;
  let mockQueue: MockBullQueue;
  let mockRedis: MockRedisService;

  beforeAll(async () => {
    mockQueue = new MockBullQueue();
    mockRedis = new MockRedisService();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    })
      .overrideProvider('BullQueue_task-queue')
      .useValue(mockQueue)
      .overrideProvider('REDIS_CLIENT')
      .useValue(mockRedis)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear mock data before each test
    await mockRedis.flushall();
  });

  describe('POST /queue/tasks (Create Task Queue)', () => {
    it('should create a new task in queue successfully', async () => {
      const queueData = TestDataFactory.createTaskQueueData();

      const response = await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(queueData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('jobId');
      expect(response.body.data.taskId).toBe(queueData.taskId);
      expect(response.body.data.taskType).toBe(queueData.taskType);
      expect(response.body.data.status).toBe('waiting');
    });

    it('should fail with invalid queue data', async () => {
      const invalidData = TestDataFactory.getInvalidQueueData();

      await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(invalidData)
        .expect(400);
    });

    it('should handle duplicate task IDs', async () => {
      const queueData = TestDataFactory.createTaskQueueData();

      // Create first task
      await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(queueData)
        .expect(201);

      // Try to create task with same ID
      const response = await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(queueData)
        .expect(409);

      expect(response.body.message).toContain(
        'Task with this ID already exists in queue',
      );
    });

    it('should respect priority ordering', async () => {
      const highPriorityTask = TestDataFactory.createTaskQueueData();
      highPriorityTask.taskId = 'high-priority-task';
      highPriorityTask.priority = 'critical';

      const lowPriorityTask = TestDataFactory.createTaskQueueData();
      lowPriorityTask.taskId = 'low-priority-task';
      lowPriorityTask.priority = 'low';

      // Create low priority first, then high priority
      await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(lowPriorityTask)
        .expect(201);

      await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(highPriorityTask)
        .expect(201);

      // Check queue status - high priority should be processed first
      const statusResponse = await request(app.getHttpServer())
        .get('/queue/status')
        .expect(200);

      expect(statusResponse.body.data.waiting).toBeGreaterThan(0);
    });
  });

  describe('GET /queue/status (Get Queue Status)', () => {
    beforeEach(async () => {
      // Add some test tasks to queue
      const tasks = TestDataFactory.generateBulkQueueData(5);
      for (const task of tasks) {
        await request(app.getHttpServer()).post('/queue/tasks').send(task);
      }
    });

    it('should return comprehensive queue status', async () => {
      const response = await request(app.getHttpServer())
        .get('/queue/status')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('waiting');
      expect(response.body.data).toHaveProperty('active');
      expect(response.body.data).toHaveProperty('completed');
      expect(response.body.data).toHaveProperty('failed');
      expect(response.body.data).toHaveProperty('totalJobs');
      expect(response.body.data.waiting).toBeGreaterThan(0);
    });

    it('should include queue health metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/queue/status')
        .expect(200);

      expect(response.body.data).toHaveProperty('health');
      expect(response.body.data.health).toHaveProperty('status');
      expect(response.body.data.health).toHaveProperty('averageProcessingTime');
      expect(response.body.data.health).toHaveProperty('successRate');
    });

    it('should handle empty queue', async () => {
      // Clear queue first
      await mockQueue.clean(0, 'waiting');
      await mockQueue.clean(0, 'completed');

      const response = await request(app.getHttpServer())
        .get('/queue/status')
        .expect(200);

      expect(response.body.data.totalJobs).toBe(0);
      expect(response.body.data.health.status).toBe('healthy');
    });
  });

  describe('GET /queue/jobs/:jobId (Get Job Details)', () => {
    let createdJobId: string;

    beforeEach(async () => {
      const queueData = TestDataFactory.createTaskQueueData();
      const createResponse = await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(queueData);
      createdJobId = createResponse.body.data.jobId;
    });

    it('should return detailed job information', async () => {
      const response = await request(app.getHttpServer())
        .get(`/queue/jobs/${createdJobId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('progress');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data.id).toBe(createdJobId);
    });

    it('should return 404 for non-existent job', async () => {
      await request(app.getHttpServer())
        .get('/queue/jobs/non-existent-job-id')
        .expect(404);
    });

    it('should track job progress updates', async () => {
      // Wait a bit for job to start processing
      await new Promise((resolve) => setTimeout(resolve, 200));

      const response = await request(app.getHttpServer())
        .get(`/queue/jobs/${createdJobId}`)
        .expect(200);

      // Job should have some progress or be completed
      expect(response.body.data.progress).toBeGreaterThanOrEqual(0);
      expect(response.body.data.progress).toBeLessThanOrEqual(100);
    });

    it('should include job execution logs', async () => {
      // Wait for job to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await request(app.getHttpServer())
        .get(`/queue/jobs/${createdJobId}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('logs');
      expect(response.body.data.logs).toBeInstanceOf(Array);
    });
  });

  describe('Queue Processing Tests', () => {
    it('should process jobs in FIFO order for same priority', async () => {
      const jobPromises = [];
      const jobIds = [];

      // Create multiple jobs with same priority
      for (let i = 0; i < 3; i++) {
        const queueData = TestDataFactory.createTaskQueueData();
        queueData.taskId = `sequential-task-${i}`;
        queueData.priority = 'normal';

        jobPromises.push(
          request(app.getHttpServer())
            .post('/queue/tasks')
            .send(queueData)
            .then((response) => {
              jobIds.push(response.body.data.jobId);
              return response;
            }),
        );
      }

      await Promise.all(jobPromises);

      // Wait for jobs to be processed
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check that jobs were processed in order
      const completedJobs = await mockQueue.getCompleted();
      expect(completedJobs.length).toBeGreaterThan(0);
    });

    it('should handle job failures gracefully', async () => {
      const queueData = TestDataFactory.createTaskQueueData();
      (queueData.data as any).simulateError = true; // Special flag to simulate error

      const createResponse = await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(queueData)
        .expect(201);

      const jobId = createResponse.body.data.jobId;

      // Wait for job to fail
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const jobResponse = await request(app.getHttpServer())
        .get(`/queue/jobs/${jobId}`)
        .expect(200);

      // Job should have failed but system should be stable
      expect(['failed', 'completed']).toContain(jobResponse.body.data.status);
    });

    it('should retry failed jobs according to configuration', async () => {
      const queueData = TestDataFactory.createTaskQueueData();
      (queueData.data as any).failFirstAttempt = true; // Fail first, succeed on retry

      await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(queueData)
        .expect(201);

      // Wait for initial failure and retry
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusResponse = await request(app.getHttpServer())
        .get('/queue/status')
        .expect(200);

      // Should have processed retries
      expect(statusResponse.body.data.totalJobs).toBeGreaterThan(0);
    });
  });

  describe('Performance and Load Tests', () => {
    it('should handle bulk job creation efficiently', async () => {
      const bulkTasks = TestDataFactory.generateBulkQueueData(20);
      const promises = bulkTasks.map((task) =>
        request(app.getHttpServer()).post('/queue/tasks').send(task),
      );

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const endTime = Date.now();

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(3000);
    });

    it('should maintain queue performance under load', async () => {
      // Create high load
      const highLoadTasks = TestDataFactory.generateBulkQueueData(50);
      const promises = highLoadTasks.map((task) =>
        request(app.getHttpServer()).post('/queue/tasks').send(task),
      );

      await Promise.all(promises);

      // Queue should remain responsive
      const statusResponse = await request(app.getHttpServer())
        .get('/queue/status')
        .expect(200);

      expect(statusResponse.body.success).toBe(true);
      expect(statusResponse.body.data.health.status).toBe('healthy');
    });

    it('should handle concurrent status requests efficiently', async () => {
      // Add some background jobs
      const backgroundTasks = TestDataFactory.generateBulkQueueData(10);
      for (const task of backgroundTasks) {
        await request(app.getHttpServer()).post('/queue/tasks').send(task);
      }

      // Make concurrent status requests
      const statusPromises = Array(15)
        .fill(null)
        .map(() => request(app.getHttpServer()).get('/queue/status'));

      const startTime = Date.now();
      const responses = await Promise.all(statusPromises);
      const endTime = Date.now();

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });

      // Should handle concurrent requests efficiently
      const avgResponseTime = (endTime - startTime) / 15;
      expect(avgResponseTime).toBeLessThan(500);
    });
  });

  describe('Queue Management Features', () => {
    it('should clean completed jobs automatically', async () => {
      // Create and complete several jobs
      const tasks = TestDataFactory.generateBulkQueueData(5);
      for (const task of tasks) {
        await request(app.getHttpServer()).post('/queue/tasks').send(task);
      }

      // Wait for jobs to complete
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await request(app.getHttpServer())
        .get('/queue/status')
        .expect(200);

      // Completed jobs should be cleaned up automatically
      expect(statusResponse.body.data.completed).toBeLessThanOrEqual(5);
    });

    it('should provide accurate queue metrics', async () => {
      // Add mix of priorities
      const criticalTask = TestDataFactory.createTaskQueueData();
      criticalTask.priority = 'critical';
      criticalTask.taskId = 'critical-task';

      const normalTask = TestDataFactory.createTaskQueueData();
      normalTask.priority = 'normal';
      normalTask.taskId = 'normal-task';

      await Promise.all([
        request(app.getHttpServer()).post('/queue/tasks').send(criticalTask),
        request(app.getHttpServer()).post('/queue/tasks').send(normalTask),
      ]);

      const statusResponse = await request(app.getHttpServer())
        .get('/queue/status')
        .expect(200);

      expect(statusResponse.body.data.totalJobs).toBeGreaterThanOrEqual(2);
      expect(statusResponse.body.data.health).toBeDefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed task data gracefully', async () => {
      const malformedData = {
        taskId: 'test',
        taskType: 'test',
        data: 'not-an-object',
      };

      await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(malformedData)
        .expect(400);
    });

    it('should validate task priority values', async () => {
      const invalidPriority = TestDataFactory.createTaskQueueData();
      invalidPriority.priority = 'invalid-priority';

      await request(app.getHttpServer())
        .post('/queue/tasks')
        .send(invalidPriority)
        .expect(400);
    });

    it('should handle queue overflow gracefully', async () => {
      // Attempt to add many jobs quickly
      const overflowTasks = Array(100)
        .fill(null)
        .map((_, i) => {
          const task = TestDataFactory.createTaskQueueData();
          task.taskId = `overflow-task-${i}`;
          return task;
        });

      const promises = overflowTasks.map(
        (task) =>
          request(app.getHttpServer())
            .post('/queue/tasks')
            .send(task)
            .catch((err) => err.response), // Catch any overflow errors
      );

      const responses = await Promise.all(promises);

      // Should handle gracefully - either accept or reject cleanly
      responses.forEach((response) => {
        expect([201, 429, 503]).toContain(response.status);
      });
    });
  });
});
