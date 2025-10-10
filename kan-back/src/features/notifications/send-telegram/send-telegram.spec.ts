import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SendTelegramController } from './send-telegram.controller';
import { SendTelegramService } from './send-telegram.service';
import { SendTelegramRequestDto } from './send-telegram.request.dto';

describe('SendTelegramController', () => {
  let controller: SendTelegramController;
  let service: SendTelegramService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue({
      botToken: 'test-bot-token',
      defaultChatId: '123456789',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendTelegramController],
      providers: [
        SendTelegramService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<SendTelegramController>(SendTelegramController);
    service = module.get<SendTelegramService>(SendTelegramService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send telegram message successfully', async () => {
    const mockRequest: SendTelegramRequestDto = {
      chatId: '123456789',
      text: 'Test notification message',
      parseMode: 'HTML',
    };

    const mockResponse = {
      success: true,
      messageId: 123,
      message: 'Telegram message sent successfully',
      chatId: '123456789',
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle(mockRequest);

    expect(result).toEqual(mockResponse);
    expect(service.execute).toHaveBeenCalledWith(mockRequest);
  });

  it('should handle telegram sending failure', async () => {
    const mockRequest: SendTelegramRequestDto = {
      chatId: 'invalid-chat-id',
      text: 'Test message',
    };

    const mockResponse = {
      success: false,
      message: 'Failed to send Telegram message: Invalid chat ID',
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle(mockRequest);

    expect(result).toEqual(mockResponse);
    expect(service.execute).toHaveBeenCalledWith(mockRequest);
  });
});
