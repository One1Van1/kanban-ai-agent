import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckService } from './health-check.service';
import { HealthCheckResponseDto } from './health-check.response.dto';
import { ApiHealthCheck } from './openapi.decorator';

@Controller('jira')
@ApiTags('HealthCheck')
export class HealthCheckController {
  constructor(private readonly service: HealthCheckService) {}

  @Get('health')
  @ApiHealthCheck()
  async handle(): Promise<HealthCheckResponseDto> {
    return this.service.execute();
  }
}
