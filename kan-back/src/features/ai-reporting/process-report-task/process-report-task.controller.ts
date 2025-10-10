import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcessReportTaskService } from './process-report-task.service';
import { ProcessReportTaskRequestDto } from './process-report-task.request.dto';
import { ProcessReportTaskResponseDto } from './process-report-task.response.dto';
import { ApiProcessReportTask } from './openapi.decorator';

@ApiTags('ProcessReportTask')
@Controller('ai-reporting-agent/generate-report')
export class ProcessReportTaskController {
  private readonly logger = new Logger(ProcessReportTaskController.name);

  constructor(private readonly service: ProcessReportTaskService) {}

  @Post('process-task')
  @ApiProcessReportTask()
  async handle(
    @Body() dto: ProcessReportTaskRequestDto,
  ): Promise<ProcessReportTaskResponseDto> {
    this.logger.log(`🎯 Processing report task: ${dto.taskKey}`);

    try {
      const result = await this.service.execute(dto);
      this.logger.log(`✅ ${result.message}`);
      return result;
    } catch (error) {
      this.logger.error(
        `❌ Failed to process report task ${dto.taskKey}:`,
        error,
      );
      throw error;
    }
  }
}
