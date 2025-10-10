import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { HealthCheckResponseDto } from './health-check.response.dto';
export declare class HealthCheckService extends JiraBaseService {
    execute(): Promise<HealthCheckResponseDto>;
}
