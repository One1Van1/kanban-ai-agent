import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetQueueStatusService,
  QueueStatusResponse,
} from './get-queue-status.service';
import { ApiGetQueueStatus } from './openapi.decorator';

@Controller('queue')
@ApiTags('GetQueueStatus')
export class GetQueueStatusController {
  private readonly logger = new Logger(GetQueueStatusController.name);

  constructor(private readonly getQueueStatusService: GetQueueStatusService) {}

  @Get('status')
  @ApiGetQueueStatus()
  async handle(): Promise<QueueStatusResponse> {
    this.logger.log('Received request for queue status');
    return this.getQueueStatusService.getQueueStatus();
  }
}
