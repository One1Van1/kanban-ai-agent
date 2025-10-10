export declare class NotificationLog {
    id: string;
    agentId?: string;
    taskHistoryId?: string;
    type: string;
    recipient: string;
    subject: string;
    content: string;
    status: string;
    metadata: Record<string, any>;
    error?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    retryCount?: number;
    nextRetryAt?: Date;
    createdAt: Date;
}
