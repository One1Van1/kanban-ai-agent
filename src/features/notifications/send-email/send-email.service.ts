import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailRequestDto } from './send-email.request.dto';
import { SendEmailResponseDto } from './send-email.response.dto';

@Injectable()
export class SendEmailService {
  private readonly logger = new Logger(SendEmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = this.configService.get('notifications.email');

    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  }

  async execute(request: SendEmailRequestDto): Promise<SendEmailResponseDto> {
    try {
      const emailConfig = this.configService.get('notifications.email');

      const mailOptions = {
        from: emailConfig.from,
        to: request.to,
        subject: request.subject,
        text: request.text,
        html: request.html,
        cc: request.cc,
        bcc: request.bcc,
      };

      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(
        `Email sent successfully to ${request.to}. MessageId: ${info.messageId}`,
      );

      return new SendEmailResponseDto(
        true,
        info.messageId,
        'Email sent successfully',
      );
    } catch (error) {
      this.logger.error(`Failed to send email to ${request.to}:`, error);

      return new SendEmailResponseDto(
        false,
        '',
        `Failed to send email: ${error.message}`,
      );
    }
  }
}
