import { CacheContextService } from './cache-context.service';
import { CacheContextRequestDto } from './cache-context.request.dto';
import { CacheContextResponseDto } from './cache-context.response.dto';
export declare class CacheContextController {
    private readonly service;
    constructor(service: CacheContextService);
    handle(request: CacheContextRequestDto): Promise<CacheContextResponseDto>;
}
