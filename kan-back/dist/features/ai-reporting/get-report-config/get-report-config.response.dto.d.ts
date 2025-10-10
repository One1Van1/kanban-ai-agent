export declare class GetReportConfigResponseDto {
    service: string;
    supportedDateFormats: string[];
    defaultDateRange: string;
    reportTypes: string[];
    constructor(service: string, supportedDateFormats: string[], defaultDateRange: string, reportTypes: string[]);
}
