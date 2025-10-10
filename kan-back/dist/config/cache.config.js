"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('cache', () => ({
    store: 'redis',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_CACHE_DB || '1', 10),
    ttl: parseInt(process.env.CACHE_TTL || '300', 10),
    max: parseInt(process.env.CACHE_MAX_ITEMS || '1000', 10),
    contextTtl: parseInt(process.env.CONTEXT_CACHE_TTL || '600', 10),
    agentConfigTtl: parseInt(process.env.AGENT_CONFIG_CACHE_TTL || '1800', 10),
    taskHistoryTtl: parseInt(process.env.TASK_HISTORY_CACHE_TTL || '300', 10),
    prefixes: {
        context: 'ctx:',
        agentConfig: 'agent:',
        taskHistory: 'history:',
        queue: 'queue:',
    },
}));
//# sourceMappingURL=cache.config.js.map