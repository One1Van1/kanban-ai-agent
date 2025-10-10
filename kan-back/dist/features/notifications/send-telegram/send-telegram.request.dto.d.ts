export declare class SendTelegramRequestDto {
    chatId: string;
    text: string;
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    disableWebPagePreview?: boolean;
    disableNotification?: boolean;
}
