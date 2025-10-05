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

@Entity('agent_instructions')
export class AgentInstruction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  agentId: string;

  @Column({ type: 'varchar', length: 255 })
  columnId: string;

  @Column({ type: 'varchar', length: 255 })
  columnName: string;

  @Column({ type: 'text' })
  instruction: string;

  @Column({ type: 'varchar', length: 100 })
  triggerEvent: string; // 'on_enter' | 'on_exit' | 'on_update'

  @Column({ type: 'jsonb', nullable: true })
  conditions: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  actions: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Agent, (agent) => agent.instructions)
  @JoinColumn({ name: 'agentId' })
  agent: Agent;
}
