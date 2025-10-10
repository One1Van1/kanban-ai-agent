export declare class CacheContextResponseDto {
    success: boolean;
    cacheKey: string;
    ttl: number;
    cachedAt: string;
    message: string;
    constructor(success: boolean, cacheKey: string, ttl: number, message: string);
}
