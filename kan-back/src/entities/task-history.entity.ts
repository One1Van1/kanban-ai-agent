import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Agent } from './agent.entity';

@Entity('task_histories')
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  agentId: string;

  @Column({ type: 'varchar', length: 255 })
  taskId: string;

  @Column({ type: 'varchar', length: 255 })
  taskKey: string;

  @Column({ type: 'varchar', length: 500 })
  taskTitle: string;

  @Column({ type: 'varchar', length: 100 })
  action: string; // 'created' | 'updated' | 'status_changed' | 'assigned' | 'completed'

  @Column({ type: 'varchar', length: 255, nullable: true })
  fromStatus?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  toStatus?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fromColumn?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  toColumn?: string;

  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  agentResponse: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  executedInstruction?: string;

  @Column({ type: 'varchar', length: 100 })
  status: string; // 'pending' | 'processing' | 'completed' | 'failed'

  @Column({ type: 'text', nullable: true })
  error?: string;

  @Column({ type: 'integer', nullable: true })
  processingTimeMs?: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Agent, (agent) => agent.taskHistories)
  @JoinColumn({ name: 'agentId' })
  agent: Agent;
}
