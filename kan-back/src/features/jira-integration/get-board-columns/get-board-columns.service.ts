import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetBoardColumnsRequestDto } from './get-board-columns.request.dto';
import {
  GetBoardColumnsResponseDto,
  JiraColumn,
  JiraBoardInfo,
} from './get-board-columns.response.dto';

@Injectable()
export class GetBoardColumnsService {
  private readonly logger = new Logger(GetBoardColumnsService.name);

  constructor(private readonly configService: ConfigService) {}

  async execute(
    requestDto: GetBoardColumnsRequestDto,
  ): Promise<GetBoardColumnsResponseDto> {
    const { boardId } = requestDto;

    this.logger.log(`🔍 Getting columns for Jira board: ${boardId}`);

    try {
      // 1. Получаем информацию о доске
      const boardInfo = await this.getBoardInfo(boardId);
      this.logger.log(`📋 Board info retrieved: ${boardInfo.name}`);

      // 2. Получаем конфигурацию доски (колонки)
      const boardConfig = await this.getBoardConfiguration(boardId);
      this.logger.log(`⚙️ Board configuration retrieved`);

      // 3. Парсим колонки из конфигурации
      const columns = this.parseColumnsFromConfig(boardConfig);
      this.logger.log(`📊 Parsed ${columns.length} columns`);

      return new GetBoardColumnsResponseDto(
        boardId,
        boardInfo,
        columns,
        `Successfully retrieved ${columns.length} columns for board ${boardInfo.name}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to get board columns for ${boardId}:`,
        error.stack,
      );

      if (error.response?.status === 404) {
        throw new NotFoundException(`Board with ID ${boardId} not found`);
      }

      throw new Error(`Failed to get board columns: ${error.message}`);
    }
  }

  /**
   * Получить основную информацию о доске
   */
  private async getBoardInfo(boardId: string): Promise<JiraBoardInfo> {
    const jiraUrl = this.configService.get<string>('jira.baseUrl');
    const jiraToken = this.configService.get<string>('jira.token');
    const jiraEmail = this.configService.get<string>('jira.email');

    const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');

    const response = await axios.get(
      `${jiraUrl}/rest/agile/1.0/board/${boardId}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      },
    );

    const board = response.data;

    return {
      id: board.id.toString(),
      name: board.name,
      type: board.type.toLowerCase(),
      projectKey: board.location?.projectKey || 'UNKNOWN',
    };
  }

  /**
   * Получить конфигурацию доски (колонки и статусы)
   */
  private async getBoardConfiguration(boardId: string): Promise<any> {
    const jiraUrl = this.configService.get<string>('jira.baseUrl');
    const jiraToken = this.configService.get<string>('jira.token');
    const jiraEmail = this.configService.get<string>('jira.email');

    const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');

    const response = await axios.get(
      `${jiraUrl}/rest/agile/1.0/board/${boardId}/configuration`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      },
    );

    return response.data;
  }

  /**
   * Парсит колонки из конфигурации доски
   */
  private parseColumnsFromConfig(boardConfig: any): JiraColumn[] {
    const columns: JiraColumn[] = [];

    if (!boardConfig.columnConfig?.columns) {
      this.logger.warn('No columns found in board configuration');
      return columns;
    }

    const configColumns = boardConfig.columnConfig.columns;

    configColumns.forEach((col: any, index: number) => {
      const column: JiraColumn = {
        id: col.name.toLowerCase().replace(/\s+/g, '-'), // Создаем ID из названия
        name: col.name,
        statusIds: col.statuses?.map((status: any) => status.id) || [],
        isFirst: index === 0,
        isLast: index === configColumns.length - 1,
      };

      if (col.maxItems !== undefined) {
        column.maxItems = col.maxItems;
      }

      columns.push(column);
    });

    return columns;
  }
}
