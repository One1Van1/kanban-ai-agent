"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('ai-agent', () => ({
    defaultModel: process.env.AI_AGENT_MODEL || 'claude-3-haiku-20240307',
    maxTokens: parseInt(process.env.AI_AGENT_MAX_TOKENS || '4000', 10),
    temperature: parseFloat(process.env.AI_AGENT_TEMPERATURE || '0.3'),
    defaultInstructions: process.env.AI_AGENT_DEFAULT_INSTRUCTIONS ||
        'You are a helpful AI agent for Kanban task management. Follow instructions precisely and provide structured responses.',
    maxRetries: parseInt(process.env.AI_AGENT_MAX_RETRIES || '3', 10),
    timeoutMs: parseInt(process.env.AI_AGENT_TIMEOUT_MS || '30000', 10),
    maxContextLength: parseInt(process.env.AI_AGENT_MAX_CONTEXT_LENGTH || '10000', 10),
    enableTracking: process.env.AI_AGENT_ENABLE_TRACKING !== 'false',
    trackingRetentionDays: parseInt(process.env.AI_AGENT_TRACKING_RETENTION_DAYS || '30', 10),
}));
//# sourceMappingURL=ai-agent.config.js.map