import { ApiProperty } from '@nestjs/swagger';

interface AnalysisResult {
  clientInfo: {
    gender: string;
    haircutStyle: string;
  };
  transformation: {
    category: string;
    difficultyLevel: number;
  };
  quality: {
    overallScore: number;
    technicalExecution: number;
    creativity: number;
    clientSatisfaction: number;
  };
  improvements: string[];
  compliance: boolean;
  notes: string;
  confidenceLevel: number;
}

export class AnalyzeBeforeAfterPhotosResponseDto {
  @ApiProperty({
    description: 'Успешность выполнения анализа',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Ключ задачи',
    example: 'KAN-123',
  })
  taskKey: string;

  @ApiProperty({
    description: 'Сообщение о результате',
    example: 'Before/after analysis completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Результат анализа фото',
    example: {
      detectedCategory: 'Женская стрижка',
      qualityScore: 85,
      improvements: ['Аккуратность линий', 'Общая форма'],
      compliance: true,
      notes: 'Качественная работа',
      confidenceLevel: 90,
    },
  })
  analysis: AnalysisResult;

  @ApiProperty({
    description: 'Время обработки',
    example: '2024-01-20T12:00:00Z',
  })
  processedAt: string;

  constructor(
    success: boolean,
    taskKey: string,
    message: string,
    analysis: AnalysisResult,
  ) {
    this.success = success;
    this.taskKey = taskKey;
    this.message = message;
    this.analysis = analysis;
    this.processedAt = new Date().toISOString();
  }
}
