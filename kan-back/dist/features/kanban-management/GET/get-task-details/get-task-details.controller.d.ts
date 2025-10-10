import { GetTaskDetailsService } from './get-task-details.service';
import { GetTaskDetailsResponseDto } from './get-task-details.response.dto';
export declare class GetTaskDetailsController {
    private readonly service;
    constructor(service: GetTaskDetailsService);
    handle(id: number): Promise<GetTaskDetailsResponseDto>;
}
