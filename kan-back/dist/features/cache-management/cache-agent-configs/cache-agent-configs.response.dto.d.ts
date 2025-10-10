export declare class CacheAgentConfigsResponseDto {
    success: boolean;
    agentId: string;
    cacheKey: string;
    ttl: number;
    cachedAt: string;
    message: string;
    constructor(success: boolean, agentId: string, cacheKey: string, ttl: number, message: string);
}
