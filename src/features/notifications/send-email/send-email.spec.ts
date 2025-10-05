import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SendEmailController } from './send-email.controller';
import { SendEmailService } from './send-email.service';
import { SendEmailRequestDto } from './send-email.request.dto';

describe('SendEmailController', () => {
  let controller: SendEmailController;
  let service: SendEmailService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue({
      host: 'smtp.test.com',
      port: 587,
      secure: false,
      auth: {
        user: 'test@test.com',
        pass: 'testpass',
      },
      from: 'noreply@test.com',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendEmailController],
      providers: [
        SendEmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<SendEmailController>(SendEmailController);
    service = module.get<SendEmailService>(SendEmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send email successfully', async () => {
    const mockRequest: SendEmailRequestDto = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test message',
    };

    const mockResponse = {
      success: true,
      messageId: 'test-message-id',
      message: 'Email sent successfully',
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle(mockRequest);

    expect(result).toEqual(mockResponse);
    expect(service.execute).toHaveBeenCalledWith(mockRequest);
  });

  it('should handle email sending failure', async () => {
    const mockRequest: SendEmailRequestDto = {
      to: 'invalid-email',
      subject: 'Test Subject',
      text: 'Test message',
    };

    const mockResponse = {
      success: false,
      messageId: '',
      message: 'Failed to send email: Invalid email address',
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle(mockRequest);

    expect(result).toEqual(mockResponse);
    expect(service.execute).toHaveBeenCalledWith(mockRequest);
  });
});
