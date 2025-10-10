export declare class SendTelegramResponseDto {
    success: boolean;
    messageId?: number;
    message: string;
    chatId?: string;
    constructor(success: boolean, message: string, messageId?: number, chatId?: string);
}
