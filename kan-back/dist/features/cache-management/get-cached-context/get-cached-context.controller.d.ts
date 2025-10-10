import { GetCachedContextService } from './get-cached-context.service';
import { GetCachedContextResponseDto } from './get-cached-context.response.dto';
export declare class GetCachedContextController {
    private readonly service;
    constructor(service: GetCachedContextService);
    handle(key: string): Promise<GetCachedContextResponseDto>;
}
