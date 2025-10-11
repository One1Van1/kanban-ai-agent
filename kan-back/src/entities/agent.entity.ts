import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AgentInstruction } from './agent-instruction.entity';
import { TaskHistory } from './task-history.entity';
import { BoardIntegration } from './board-integration.entity';
import { BoardType } from '../types/board-integration.interface';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  status: string; // 'active' | 'inactive' | 'paused'

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @Column({
    type: 'enum',
    enum: BoardType,
    nullable: true,
  })
  boardType?: BoardType;

  @Column({ type: 'jsonb', nullable: true })
  boardConfig: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  contextSources: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  notificationSettings: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AgentInstruction, (instruction) => instruction.agent)
  instructions: AgentInstruction[];

  @OneToMany(() => TaskHistory, (history) => history.agent)
  taskHistories: TaskHistory[];

  @OneToMany(() => BoardIntegration, (integration) => integration.agent)
  boardIntegrations: BoardIntegration[];
}
