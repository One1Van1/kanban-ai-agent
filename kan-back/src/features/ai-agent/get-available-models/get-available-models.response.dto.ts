import { ApiProperty } from '@nestjs/swagger';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
  capabilities: string[];
  pricing?: {
    inputCost: number;
    outputCost: number;
    currency: string;
  };
  isAvailable: boolean;
}

export class GetAvailableModelsResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({
    description: 'Available AI models',
    example: [
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        provider: 'Anthropic',
        description: 'Fast and capable AI model for most tasks',
        maxTokens: 4000,
        contextWindow: 200000,
        capabilities: ['text', 'vision', 'reasoning'],
        pricing: {
          inputCost: 0.003,
          outputCost: 0.015,
          currency: 'USD',
        },
        isAvailable: true,
      },
    ],
  })
  models: AIModel[];

  @ApiProperty({ description: 'Total models count' })
  totalModels: number;

  @ApiProperty({ description: 'Available models count' })
  availableModels: number;

  constructor(
    models: AIModel[],
    message: string = 'Available AI models retrieved successfully',
  ) {
    this.success = true;
    this.message = message;
    this.models = models;
    this.totalModels = models.length;
    this.availableModels = models.filter((m) => m.isAvailable).length;
  }
}
