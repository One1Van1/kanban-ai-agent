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
import { FlowDefinitionData } from '../types/flow-definition.types';

export enum FlowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity('flows')
export class Flow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb' })
  definition: FlowDefinitionData;

  @Column({ type: 'uuid', nullable: true })
  agentId?: string;

  @ManyToOne(() => Agent, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'agentId' })
  agent?: Agent;

  @Column({
    type: 'enum',
    enum: FlowStatus,
    default: FlowStatus.DRAFT,
  })
  status: FlowStatus;

  @Column({ type: 'varchar', length: 255 })
  createdBy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updatedBy?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    version?: number;
    tags?: string[];
    category?: string;
    isTemplate?: boolean;
    originalFlowId?: string; // For cloned flows
  };

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Helper methods
  isActive(): boolean {
    return this.status === FlowStatus.ACTIVE;
  }

  isDraft(): boolean {
    return this.status === FlowStatus.DRAFT;
  }

  hasAgent(): boolean {
    return !!this.agentId;
  }

  getBlocksCount(): number {
    return this.definition?.blocks?.length || 0;
  }

  getTriggersCount(): number {
    return this.definition?.triggers?.length || 0;
  }
}
