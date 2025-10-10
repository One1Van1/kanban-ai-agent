import { HealthCheckService } from './health-check.service';
import { HealthCheckResponseDto } from './health-check.response.dto';
export declare class HealthCheckController {
    private readonly service;
    constructor(service: HealthCheckService);
    handle(): Promise<HealthCheckResponseDto>;
}
