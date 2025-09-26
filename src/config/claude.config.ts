import { registerAs } from '@nestjs/config';

export interface ClaudeConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}

export default registerAs(
  'claude',
  (): ClaudeConfig => ({
    apiKey: process.env.OPENROUTER_API_KEY || process.env.CLAUDE_API_KEY || '',
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    model: process.env.CLAUDE_MODEL || 'anthropic/claude-3.5-sonnet',
    maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '2048', 10),
    temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.3'),
    timeout: parseInt(process.env.CLAUDE_TIMEOUT || '30000', 10), // 30 seconds
  }),
);
