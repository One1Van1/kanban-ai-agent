export declare class GetCachedContextResponseDto {
    found: boolean;
    cacheKey: string;
    contextData: Record<string, any> | null;
    message: string;
    retrievedAt: string;
    constructor(found: boolean, cacheKey: string, contextData: Record<string, any> | null, message: string);
}
