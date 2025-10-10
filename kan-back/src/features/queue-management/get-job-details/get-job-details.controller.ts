import {
  Controller,
  Get,
  Param,
  Logger,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetJobDetailsService } from './get-job-details.service';
import { ApiGetJobDetails } from './openapi.decorator';

@Controller('queue')
@ApiTags('GetJobDetails')
export class GetJobDetailsController {
  private readonly logger = new Logger(GetJobDetailsController.name);

  constructor(private readonly getJobDetailsService: GetJobDetailsService) {}

  @Get('jobs/:jobId')
  @ApiGetJobDetails()
  async handle(@Param('jobId') jobId: string) {
    this.logger.log(`Received request for job details: ${jobId}`);

    const jobDetails = await this.getJobDetailsService.getJobDetails(jobId);

    if (!jobDetails) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    return jobDetails;
  }
}
