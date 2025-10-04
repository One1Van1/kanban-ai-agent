import { ApiProperty } from '@nestjs/swagger';

export interface ReportStatistics {
  totalHaircuts: number;
  averageScore: number;
  excellentCount: number; // 9-10
  goodCount: number; // 7-8
  satisfactoryCount: number; // 5-6
  poorCount: number; // 1-4
  dateRange: {
    startDate: string;
    endDate: string;
  };
  // Новая аналитика
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
      weekdays: { count: number; percentage: number };
      weekends: { count: number; percentage: number };
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

export class GenerateReportResponseDto {
  @ApiProperty({
    description: 'Report statistics',
  })
  statistics: ReportStatistics;

  @ApiProperty({
    description: 'Detailed analysis of individual haircuts',
    isArray: true,
  })
  detailedAnalysis: HaircutAnalysis[];

  @ApiProperty({
    description: 'AI-generated recommendations',
    isArray: true,
    example: ['Consider scheduling more appointments on quiet days'],
  })
  recommendations: string[];

  @ApiProperty({
    description: 'Report generation date',
    example: '2025-10-04T10:30:00.000Z',
  })
  reportDate: string;

  constructor(
    statistics: ReportStatistics,
    detailedAnalysis: HaircutAnalysis[],
    recommendations: string[],
    reportDate: string,
  ) {
    this.statistics = statistics;
    this.detailedAnalysis = detailedAnalysis;
    this.recommendations = recommendations;
    this.reportDate = reportDate;
  }
}
