import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Agent } from './agent.entity';
import { BoardType, BoardConfig } from '../types/board-integration.interface';

@Entity('board_integrations')
export class BoardIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  agentId: string;

  @Column({
    type: 'enum',
    enum: BoardType,
  })
  boardType: BoardType;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb' })
  config: BoardConfig;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  syncErrors?: string[];

  @Column({ type: 'jsonb', nullable: true })
  syncStats?: {
    totalTasks: number;
    lastTasksImported: number;
    lastTasksUpdated: number;
    lastTasksSkipped: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  fieldMappings?: {
    // Кастомные маппинги полей для этой интеграции
    [fieldName: string]: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  statusMappings?: {
    // Кастомные маппинги статусов для этой интеграции
    [ourStatus: string]: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;
}
