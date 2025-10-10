"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const agent_entity_1 = require("../entities/agent.entity");
const agent_instruction_entity_1 = require("../entities/agent-instruction.entity");
const task_history_entity_1 = require("../entities/task-history.entity");
const notification_log_entity_1 = require("../entities/notification-log.entity");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'kanban_ai_agent',
    entities: [agent_entity_1.Agent, agent_instruction_entity_1.AgentInstruction, task_history_entity_1.TaskHistory, notification_log_entity_1.NotificationLog],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    migrations: ['dist/migrations/*.js'],
    migrationsTableName: 'migrations',
    autoLoadEntities: true,
}));
//# sourceMappingURL=database.config.js.map