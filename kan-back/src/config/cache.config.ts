import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  store: 'redis',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_CACHE_DB || '1', 10),
  ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes default
  max: parseInt(process.env.CACHE_MAX_ITEMS || '1000', 10),

  // Specific TTL settings
  contextTtl: parseInt(process.env.CONTEXT_CACHE_TTL || '600', 10), // 10 minutes
  agentConfigTtl: parseInt(process.env.AGENT_CONFIG_CACHE_TTL || '1800', 10), // 30 minutes
  taskHistoryTtl: parseInt(process.env.TASK_HISTORY_CACHE_TTL || '300', 10), // 5 minutes

  // Cache key prefixes
  prefixes: {
    context: 'ctx:',
    agentConfig: 'agent:',
    taskHistory: 'history:',
    queue: 'queue:',
  },
}));
