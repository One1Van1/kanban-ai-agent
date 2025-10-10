import { registerAs } from '@nestjs/config';

export default registerAs('ai-agent', () => ({
  defaultModel: process.env.AI_AGENT_MODEL || 'claude-3-haiku-20240307',
  maxTokens: parseInt(process.env.AI_AGENT_MAX_TOKENS || '4000', 10),
  temperature: parseFloat(process.env.AI_AGENT_TEMPERATURE || '0.3'),

  // Agent behavior settings
  defaultInstructions:
    process.env.AI_AGENT_DEFAULT_INSTRUCTIONS ||
    'You are a helpful AI agent for Kanban task management. Follow instructions precisely and provide structured responses.',

  // Limits and timeouts
  maxRetries: parseInt(process.env.AI_AGENT_MAX_RETRIES || '3', 10),
  timeoutMs: parseInt(process.env.AI_AGENT_TIMEOUT_MS || '30000', 10),

  // Context management
  maxContextLength: parseInt(
    process.env.AI_AGENT_MAX_CONTEXT_LENGTH || '10000',
    10,
  ),

  // Agent tracking
  enableTracking: process.env.AI_AGENT_ENABLE_TRACKING !== 'false',
  trackingRetentionDays: parseInt(
    process.env.AI_AGENT_TRACKING_RETENTION_DAYS || '30',
    10,
  ),
}));
