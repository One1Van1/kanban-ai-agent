/**
 * Factory class for creating test data across all modules
 * Provides standardized test data creation for integration tests
 */
export class TestDataFactory {
  // AI Agent Test Data
  static createAgentData() {
    return {
      name: 'Test AI Agent',
      description: 'Test agent for integration testing',
      instructions:
        'Analyze tasks and provide recommendations for the test environment',
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
      maxTokens: 1000,
      isActive: true,
    };
  }

  static configureAgentData() {
    return {
      name: 'Updated Test Agent',
      description: 'Updated test agent description',
      instructions: 'Updated instructions for testing purposes',
      model: 'claude-3-sonnet-20240229',
      temperature: 0.5,
      maxTokens: 1500,
      isActive: true,
    };
  }

  static configureColumnInstructionsData() {
    return {
      agentId: 'test-agent-id',
      boardId: 'board-123',
      columnId: 'column-456',
      columnName: 'In Progress',
      instructions: 'Monitor tasks in progress and provide status updates',
      triggerConditions: [
        {
          type: 'task_moved_to_column',
          value: 'In Progress',
          operator: 'equals',
        },
      ],
      isActive: true,
    };
  }

  static executeAgentActionData() {
    return {
      agentId: 'test-agent-id',
      taskId: 'TASK-123',
      boardId: 'board-1',
      columnId: 'column-2',
      additionalContext: {
        fromColumn: 'To Do',
        toColumn: 'In Progress',
        assignee: 'john.doe@example.com',
      },
    };
  }

  static trackAgentInTaskData() {
    return {
      trackingMetadata: {
        assignee: 'john.doe@example.com',
        status: 'In Progress',
        priority: 'High',
      },
    };
  }

  // Queue Management Test Data
  static createTaskQueueData() {
    return {
      taskId: 'queue-task-123',
      taskType: 'agent_execution',
      data: {
        agentId: 'test-agent-id',
        action: 'process_task',
        metadata: {
          source: 'integration-test',
        },
      },
      priority: 'high',
    };
  }

  // Notifications Test Data
  static sendEmailData() {
    return {
      to: 'test@example.com',
      subject: 'Test Email from Integration Test',
      text: 'This is a test email sent during integration testing',
      html: '<p>This is a test email sent during integration testing</p>',
    };
  }

  static sendTelegramData() {
    return {
      chatId: '123456789',
      text: 'Test message from integration test',
      parseMode: 'HTML',
    };
  }

  // Context Management Test Data
  static configureContextSourcesData() {
    return {
      agentId: 'test-agent-id',
      jiraConfiguration: {
        projectKey: 'TEST',
        boardId: 'board-1',
        jqlQuery: 'assignee = currentUser()',
      },
      externalSources: [
        {
          name: 'External API Source',
          url: 'https://api.example.com/data',
          headers: {
            Authorization: 'Bearer test-token',
          },
        },
      ],
    };
  }

  // Test Scenarios Data
  static getCompleteWorkflowData() {
    return {
      agent: this.createAgentData(),
      columnInstructions: this.configureColumnInstructionsData(),
      contextSources: this.configureContextSourcesData(),
      taskQueue: this.createTaskQueueData(),
      emailNotification: this.sendEmailData(),
      telegramNotification: this.sendTelegramData(),
    };
  }

  // Error Scenarios Data
  static getInvalidAgentData() {
    return {
      name: '', // Invalid: empty name
      description: 'Test agent',
      instructions: 'Test instructions',
      isActive: true,
    };
  }

  static getInvalidColumnInstructionsData() {
    return {
      agentId: '', // Invalid: empty agent ID
      columnName: 'Test Column',
      instructions: '', // Invalid: empty instructions
    };
  }

  static getInvalidQueueData() {
    return {
      taskId: '', // Invalid: empty task ID
      taskType: '', // Invalid: empty task type
      data: {}, // Valid: can be empty object
    };
  }

  // Performance Test Data
  static generateBulkAgentData(count: number) {
    return Array.from({ length: count }, (_, index) => ({
      name: `Bulk Test Agent ${index + 1}`,
      description: `Bulk test agent ${index + 1} for performance testing`,
      instructions: `Bulk processing instructions for agent ${index + 1}`,
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
      maxTokens: 1000,
      isActive: true,
    }));
  }

  static generateBulkQueueData(count: number) {
    return Array.from({ length: count }, (_, index) => ({
      taskId: `bulk-task-${index}`,
      taskType: 'bulk_process',
      data: {
        agentId: `bulk-agent-${index}`,
        action: 'bulk_process',
        metadata: {
          priority: index % 2 === 0 ? 'high' : 'normal',
          source: 'bulk-test',
        },
      },
      priority: index % 2 === 0 ? 'high' : 'normal',
    }));
  }
}
