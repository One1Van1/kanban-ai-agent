import { GetAvailableStatusesService } from './get-available-statuses.service';
import { GetAvailableStatusesResponseDto } from './get-available-statuses.response.dto';
export declare class GetAvailableStatusesController {
    private readonly service;
    constructor(service: GetAvailableStatusesService);
    handle(): Promise<GetAvailableStatusesResponseDto>;
}
