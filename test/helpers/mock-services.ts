import { Injectable } from '@nestjs/common';

/**
 * Mock implementation of Bull Queue for testing
 */
@Injectable()
export class MockBullQueue {
  private jobs: Map<string, any> = new Map();
  private completedJobs: any[] = [];
  private failedJobs: any[] = [];

  async add(name: string, data: any, options?: any) {
    const jobId = `job-${Date.now()}-${Math.random()}`;
    const job = {
      id: jobId,
      name,
      data,
      options,
      status: 'waiting',
      progress: 0,
      createdAt: new Date(),
      processedOn: null,
      finishedOn: null,
    };

    this.jobs.set(jobId, job);

    // Simulate job processing
    setTimeout(() => {
      this.processJob(jobId);
    }, options?.delay || 100);

    return job;
  }

  async getJob(jobId: string) {
    return this.jobs.get(jobId);
  }

  async getJobs(status: string) {
    return Array.from(this.jobs.values()).filter(
      (job) => job.status === status,
    );
  }

  async getCompleted() {
    return this.completedJobs;
  }

  async getFailed() {
    return this.failedJobs;
  }

  async getWaiting() {
    return Array.from(this.jobs.values()).filter(
      (job) => job.status === 'waiting',
    );
  }

  async clean(grace: number, status: string) {
    if (status === 'completed') {
      this.completedJobs = [];
    } else if (status === 'failed') {
      this.failedJobs = [];
    }
  }

  private async processJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'active';
    job.processedOn = new Date();
    job.progress = 50;

    // Simulate processing time
    setTimeout(() => {
      job.progress = 100;
      job.status = 'completed';
      job.finishedOn = new Date();
      this.completedJobs.push(job);
      this.jobs.delete(jobId);
    }, 500);
  }
}

/**
 * Mock email service for testing
 */
@Injectable()
export class MockEmailService {
  private sentEmails: any[] = [];

  async sendEmail(emailData: any) {
    const email = {
      id: `email-${Date.now()}`,
      ...emailData,
      sentAt: new Date(),
      status: 'sent',
    };

    this.sentEmails.push(email);

    return {
      success: true,
      messageId: email.id,
      response: 'Email sent successfully',
    };
  }

  getSentEmails() {
    return this.sentEmails;
  }

  clearSentEmails() {
    this.sentEmails = [];
  }

  async simulateEmailError() {
    throw new Error('Failed to send email');
  }
}

/**
 * Mock Telegram service for testing
 */
@Injectable()
export class MockTelegramService {
  private sentMessages: any[] = [];

  async sendMessage(messageData: any) {
    const message = {
      id: `msg-${Date.now()}`,
      ...messageData,
      sentAt: new Date(),
      status: 'sent',
    };

    this.sentMessages.push(message);

    return {
      success: true,
      messageId: message.id,
      response: 'Message sent successfully',
    };
  }

  getSentMessages() {
    return this.sentMessages;
  }

  clearSentMessages() {
    this.sentMessages = [];
  }

  async simulateTelegramError() {
    throw new Error('Failed to send Telegram message');
  }
}

/**
 * Mock Jira service for testing
 */
@Injectable()
export class MockJiraService {
  private tasks: Map<string, any> = new Map();
  private boards: any[] = [];
  private webhookEvents: any[] = [];

  constructor() {
    // Initialize with some test data
    this.initializeTestData();
  }

  private initializeTestData() {
    // Test board
    const testBoard = {
      id: 'board-1',
      name: 'Test Board',
      columns: [
        { id: 'col-1', name: 'To Do' },
        { id: 'col-2', name: 'In Progress' },
        { id: 'col-3', name: 'Done' },
      ],
    };
    this.boards.push(testBoard);

    // Test tasks
    const testTask = {
      id: 'TASK-123',
      key: 'TASK-123',
      summary: 'Test Task',
      description: 'Test task for integration testing',
      status: 'To Do',
      assignee: 'john.doe@example.com',
      priority: 'High',
      boardId: 'board-1',
      columnId: 'col-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set('TASK-123', testTask);
  }

  async getTask(taskKey: string) {
    return this.tasks.get(taskKey);
  }

  async moveTask(taskKey: string, columnId: string) {
    const task = this.tasks.get(taskKey);
    if (task) {
      const oldColumnId = task.columnId;
      task.columnId = columnId;
      task.updatedAt = new Date();

      // Record webhook event
      this.webhookEvents.push({
        type: 'task_moved',
        taskKey,
        fromColumn: oldColumnId,
        toColumn: columnId,
        timestamp: new Date(),
      });

      return task;
    }
    throw new Error(`Task ${taskKey} not found`);
  }

  async getColumnTasks(columnId: string) {
    return Array.from(this.tasks.values()).filter(
      (task) => task.columnId === columnId,
    );
  }

  async addComment(taskKey: string, comment: string) {
    const task = this.tasks.get(taskKey);
    if (task) {
      if (!task.comments) task.comments = [];
      task.comments.push({
        id: `comment-${Date.now()}`,
        body: comment,
        author: 'ai-agent',
        createdAt: new Date(),
      });
      return task.comments[task.comments.length - 1];
    }
    throw new Error(`Task ${taskKey} not found`);
  }

  getWebhookEvents() {
    return this.webhookEvents;
  }

  clearWebhookEvents() {
    this.webhookEvents = [];
  }
}

/**
 * Mock AI service for testing
 */
@Injectable()
export class MockAIService {
  private executionLogs: any[] = [];

  async executeAgent(agentData: any) {
    const execution = {
      id: `exec-${Date.now()}`,
      agentId: agentData.agentId,
      input: agentData,
      output: {
        analysis: 'Task analysis completed',
        recommendations: ['Review priority', 'Assign to team lead'],
        confidence: 0.85,
      },
      executedAt: new Date(),
      duration: Math.random() * 1000 + 500, // 500-1500ms
      status: 'completed',
    };

    this.executionLogs.push(execution);
    return execution;
  }

  async simulateAIError() {
    throw new Error('AI service temporarily unavailable');
  }

  getExecutionLogs() {
    return this.executionLogs;
  }

  clearExecutionLogs() {
    this.executionLogs = [];
  }
}

/**
 * Mock Redis service for testing
 */
@Injectable()
export class MockRedisService {
  private storage: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    this.storage.set(key, value);

    if (ttl) {
      setTimeout(() => {
        this.storage.delete(key);
      }, ttl * 1000);
    }
  }

  async del(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.storage.has(key);
  }

  async flushall(): Promise<void> {
    this.storage.clear();
  }

  getStorage() {
    return this.storage;
  }
}

/**
 * Mock database service for testing
 */
@Injectable()
export class MockDatabaseService {
  private agents: Map<string, any> = new Map();
  private activities: Map<string, any[]> = new Map();
  private configurations: Map<string, any> = new Map();

  // Agent operations
  async saveAgent(agentData: any) {
    const agentId = agentData.id || `agent-${Date.now()}`;
    const agent = {
      ...agentData,
      id: agentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.agents.set(agentId, agent);
    return agent;
  }

  async getAgent(agentId: string) {
    return this.agents.get(agentId);
  }

  async getAllAgents() {
    return Array.from(this.agents.values());
  }

  async deleteAgent(agentId: string) {
    return this.agents.delete(agentId);
  }

  // Activity operations
  async saveActivity(agentId: string, activityData: any) {
    if (!this.activities.has(agentId)) {
      this.activities.set(agentId, []);
    }
    const activity = {
      ...activityData,
      id: `activity-${Date.now()}`,
      agentId,
      timestamp: new Date(),
    };
    this.activities.get(agentId)!.push(activity);
    return activity;
  }

  async getAgentActivities(agentId: string) {
    return this.activities.get(agentId) || [];
  }

  // Configuration operations
  async saveConfiguration(configId: string, configData: any) {
    const config = {
      ...configData,
      id: configId,
      updatedAt: new Date(),
    };
    this.configurations.set(configId, config);
    return config;
  }

  async getConfiguration(configId: string) {
    return this.configurations.get(configId);
  }

  // Cleanup methods
  clearAllData() {
    this.agents.clear();
    this.activities.clear();
    this.configurations.clear();
  }
}
