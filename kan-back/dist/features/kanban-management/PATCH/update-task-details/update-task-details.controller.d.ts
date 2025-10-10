import { UpdateTaskDetailsService } from './update-task-details.service';
import { UpdateTaskDetailsRequestDto } from './update-task-details.request.dto';
import { UpdateTaskDetailsResponseDto } from './update-task-details.response.dto';
export declare class UpdateTaskDetailsController {
    private readonly service;
    constructor(service: UpdateTaskDetailsService);
    updateDetails(taskId: string, requestDto: UpdateTaskDetailsRequestDto): Promise<UpdateTaskDetailsResponseDto>;
}
