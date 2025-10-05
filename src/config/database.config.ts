import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Agent } from '../entities/agent.entity';
import { AgentInstruction } from '../entities/agent-instruction.entity';
import { TaskHistory } from '../entities/task-history.entity';
import { NotificationLog } from '../entities/notification-log.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'kanban_ai_agent',
    entities: [Agent, AgentInstruction, TaskHistory, NotificationLog],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    migrations: ['dist/migrations/*.js'],
    migrationsTableName: 'migrations',
    autoLoadEntities: true,
  }),
);
