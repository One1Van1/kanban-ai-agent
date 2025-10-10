import { GetUserActivityService } from './get-user-activity.service';
import { GetUserActivityRequestDto } from './get-user-activity.request.dto';
import { GetUserActivityResponseDto } from './get-user-activity.response.dto';
export declare class GetUserActivityController {
    private readonly service;
    constructor(service: GetUserActivityService);
    handle(userId: string, query: GetUserActivityRequestDto): Promise<GetUserActivityResponseDto>;
}
