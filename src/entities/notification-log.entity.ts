import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  agentId?: string;

  @Column({ type: 'uuid', nullable: true })
  taskHistoryId?: string;

  @Column({ type: 'varchar', length: 100 })
  type: string; // 'email' | 'telegram' | 'slack' | 'webhook'

  @Column({ type: 'varchar', length: 255 })
  recipient: string;

  @Column({ type: 'varchar', length: 500 })
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 100 })
  status: string; // 'pending' | 'sent' | 'failed' | 'delivered'

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ type: 'integer', nullable: true })
  retryCount?: number;

  @Column({ type: 'timestamp', nullable: true })
  nextRetryAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
