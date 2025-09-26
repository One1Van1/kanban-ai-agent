import { registerAs } from '@nestjs/config';

export interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}

export default registerAs(
  'claude',
  (): ClaudeConfig => ({
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
    maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '2048', 10),
    temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.3'),
    timeout: parseInt(process.env.CLAUDE_TIMEOUT || '30000', 10), // 30 seconds
  }),
);
