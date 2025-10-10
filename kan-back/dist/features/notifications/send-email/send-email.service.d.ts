import { ConfigService } from '@nestjs/config';
import { SendEmailRequestDto } from './send-email.request.dto';
import { SendEmailResponseDto } from './send-email.response.dto';
export declare class SendEmailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    execute(request: SendEmailRequestDto): Promise<SendEmailResponseDto>;
}
