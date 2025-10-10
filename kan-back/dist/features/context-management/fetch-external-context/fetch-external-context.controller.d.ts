import { FetchExternalContextService } from './fetch-external-context.service';
import { FetchExternalContextQueryDto } from './fetch-external-context.query.dto';
import { FetchExternalContextResponseDto } from './fetch-external-context.response.dto';
export declare class FetchExternalContextController {
    private readonly service;
    constructor(service: FetchExternalContextService);
    handle(taskId: string, query: FetchExternalContextQueryDto): Promise<FetchExternalContextResponseDto>;
}
