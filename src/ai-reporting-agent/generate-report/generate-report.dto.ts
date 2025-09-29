import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateReportDto {
  @ApiProperty({
    description: 'Task key for the report request',
    example: 'KAN-33',
  })
  @IsString()
  taskKey: string;

  @ApiProperty({
    description: 'Date range description in free form',
    example: 'со вчера до вторника',
  })
  @IsString()
  dateRange: string;

  @ApiProperty({
    description: 'Assignee email who requested the report',
    example: 'ai-report-maker@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  assigneeEmail?: string;
}

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

export interface GeneratedReport {
  statistics: ReportStatistics;
  detailedAnalysis: HaircutAnalysis[];
  recommendations: string[];
  reportDate: string;
}
