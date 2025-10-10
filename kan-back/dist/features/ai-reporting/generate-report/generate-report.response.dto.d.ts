export interface ReportStatistics {
    totalHaircuts: number;
    averageScore: number;
    excellentCount: number;
    goodCount: number;
    satisfactoryCount: number;
    poorCount: number;
    dateRange: {
        startDate: string;
        endDate: string;
    };
    genderAnalysis: {
        male: {
            count: number;
            averageScore: number;
            popularStyles: string[];
        };
        female: {
            count: number;
            averageScore: number;
            popularStyles: string[];
        };
    };
    dayOfWeekAnalysis: {
        [key: string]: {
            count: number;
            averageScore: number;
            isWeekend: boolean;
        };
    };
    workloadAnalysis: {
        busiestDay: string;
        quietestDay: string;
        weekdaysVsWeekends: {
            weekdays: {
                count: number;
                percentage: number;
            };
            weekends: {
                count: number;
                percentage: number;
            };
        };
    };
}
export interface HaircutAnalysis {
    taskKey: string;
    score: number;
    summary: string;
    date: string;
    dayOfWeek: string;
    clientDescription?: string;
    gender?: 'male' | 'female' | 'unknown';
    haircutStyle?: string;
}
export declare class GenerateReportResponseDto {
    statistics: ReportStatistics;
    detailedAnalysis: HaircutAnalysis[];
    recommendations: string[];
    reportDate: string;
    constructor(statistics: ReportStatistics, detailedAnalysis: HaircutAnalysis[], recommendations: string[], reportDate: string);
}
