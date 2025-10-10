export declare class TelegramUtilsController {
    getChatIdInstructions(): {
        message: string;
        steps: string[];
        example: {
            chatId: string;
            usage: string;
        };
    };
    testMessage(body: {
        chatId: string;
        message: string;
    }): Promise<{
        message: string;
        chatId: string;
        messageText: string;
    }>;
}
