import { registerAs } from '@nestjs/config';

export interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export default registerAs(
  'claude',
  (): ClaudeConfig => ({
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
    maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '1000', 10),
    temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.7'),
  }),
);
