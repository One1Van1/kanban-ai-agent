import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BoardIntegrationFactory } from '../../shared/board-integration.factory';
import { BoardType } from '../../types/board-integration.interface';

@ApiTags('Board Integrations')
@Controller('board-integrations')
export class BoardIntegrationsController {
  constructor(
    private readonly boardIntegrationFactory: BoardIntegrationFactory,
  ) {}

  @Get('supported-types')
  @ApiOperation({
    summary: 'Get supported board types',
    description: 'Get list of all supported board integration types',
  })
  @ApiResponse({
    status: 200,
    description: 'List of supported board types',
    schema: {
      type: 'object',
      properties: {
        supportedTypes: {
          type: 'array',
          items: { type: 'string', enum: Object.values(BoardType) },
        },
        total: { type: 'number' },
      },
    },
  })
  getSupportedBoardTypes() {
    const supportedTypes =
      this.boardIntegrationFactory.getSupportedBoardTypes();

    return {
      supportedTypes,
      total: supportedTypes.length,
    };
  }

  @Get('test-connection/:boardType')
  @ApiOperation({
    summary: 'Test board connection',
    description:
      'Test connection to a specific board type with provided configuration',
  })
  @ApiResponse({
    status: 200,
    description: 'Connection test result',
    schema: {
      type: 'object',
      properties: {
        boardType: { type: 'string' },
        connectionTest: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async testConnection(
    @Param('boardType') boardType: BoardType,
    @Query() config: any,
  ) {
    try {
      // Это демонстрационный endpoint
      // В реальном приложении конфигурация должна передаваться через POST body
      const isSupported = this.boardIntegrationFactory.isSupported(boardType);

      if (!isSupported) {
        return {
          boardType,
          connectionTest: false,
          message: `Board type '${boardType}' is not supported`,
        };
      }

      // Для демонстрации используем mock конфигурацию
      const mockConfig = {
        instanceUrl: 'https://demo.atlassian.net',
        projectKey: 'DEMO',
        apiToken: 'demo-token',
      };

      const connectionTest = await this.boardIntegrationFactory.testConnection(
        boardType,
        mockConfig,
      );

      return {
        boardType,
        connectionTest,
        message: connectionTest ? 'Connection successful' : 'Connection failed',
      };
    } catch (error) {
      return {
        boardType,
        connectionTest: false,
        message: error.message,
      };
    }
  }
}
