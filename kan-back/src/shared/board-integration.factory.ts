import { Injectable, BadRequestException } from '@nestjs/common';
import { BoardType, BoardConfig } from '../types/board-integration.interface';
import { IBoardIntegrationService } from '../types/board-service.interface';

// Импорты сервисов интеграций
import { JiraBoardService } from '../features/jira-integration/services/jira-board.service';
// import { TrelloBoardService } from '../features/trello-integration/services/trello-board.service';
// import { LinearBoardService } from '../features/linear-integration/services/linear-board.service';
// import { AsanaBoardService } from '../features/asana-integration/services/asana-board.service';
// import { NotionBoardService } from '../features/notion-integration/services/notion-board.service';
// import { GitHubBoardService } from '../features/github-integration/services/github-board.service';
// import { CustomBoardService } from '../features/custom-integration/services/custom-board.service';

@Injectable()
export class BoardIntegrationFactory {
  private readonly services = new Map<BoardType, IBoardIntegrationService>();

  constructor(
    // Инжектим все сервисы интеграций
    private readonly jiraBoardService: JiraBoardService,
    // private readonly trelloBoardService: TrelloBoardService,
    // private readonly linearBoardService: LinearBoardService,
    // private readonly asanaBoardService: AsanaBoardService,
    // private readonly notionBoardService: NotionBoardService,
    // private readonly githubBoardService: GitHubBoardService,
    // private readonly customBoardService: CustomBoardService,
  ) {
    // Регистрируем только доступные сервисы
    this.services.set(BoardType.JIRA, this.jiraBoardService);
    // this.services.set(BoardType.TRELLO, this.trelloBoardService);
    // this.services.set(BoardType.LINEAR, this.linearBoardService);
    // this.services.set(BoardType.ASANA, this.asanaBoardService);
    // this.services.set(BoardType.NOTION, this.notionBoardService);
    // this.services.set(BoardType.GITHUB_PROJECTS, this.githubBoardService);
    // this.services.set(BoardType.CUSTOM, this.customBoardService);
  }

  /**
   * Получить сервис интеграции для указанного типа доски
   */
  getBoardService(boardType: BoardType): IBoardIntegrationService {
    const service = this.services.get(boardType);

    if (!service) {
      throw new BadRequestException(
        `Board integration service for type '${boardType}' is not available`,
      );
    }

    return service;
  }

  /**
   * Проверить, поддерживается ли данный тип доски
   */
  isSupported(boardType: BoardType): boolean {
    return this.services.has(boardType);
  }

  /**
   * Получить список всех поддерживаемых типов досок
   */
  getSupportedBoardTypes(): BoardType[] {
    return Array.from(this.services.keys());
  }

  /**
   * Проверить подключение для указанного типа доски и конфигурации
   */
  async testConnection(
    boardType: BoardType,
    config: BoardConfig,
  ): Promise<boolean> {
    const service = this.getBoardService(boardType);
    return await service.testConnection(config);
  }

  /**
   * Валидировать конфигурацию для указанного типа доски
   */
  async validateConfig(
    boardType: BoardType,
    config: BoardConfig,
  ): Promise<{ valid: boolean; errors: string[] }> {
    const service = this.getBoardService(boardType);
    return await service.validateConfig(config);
  }

  /**
   * Получить доски для указанного типа и конфигурации
   */
  async getBoards(boardType: BoardType, config: BoardConfig) {
    const service = this.getBoardService(boardType);
    return await service.getBoards(config);
  }

  /**
   * Получить задачи для указанного типа доски и конфигурации
   */
  async getTasks(boardType: BoardType, config: BoardConfig, boardId?: string) {
    const service = this.getBoardService(boardType);
    return await service.getTasks(config, boardId);
  }

  /**
   * Создать задачу в указанной доске
   */
  async createTask(boardType: BoardType, config: BoardConfig, task: any) {
    const service = this.getBoardService(boardType);
    return await service.createTask(config, task);
  }

  /**
   * Обновить задачу в указанной доске
   */
  async updateTask(boardType: BoardType, config: BoardConfig, task: any) {
    const service = this.getBoardService(boardType);
    return await service.updateTask(config, task);
  }

  /**
   * Переместить задачу между колонками/статусами
   */
  async moveTask(
    boardType: BoardType,
    config: BoardConfig,
    taskId: string,
    newStatus: string,
  ) {
    const service = this.getBoardService(boardType);
    return await service.moveTask(config, taskId, newStatus);
  }

  /**
   * Синхронизировать данные с внешней системой
   */
  async syncData(boardType: BoardType, config: BoardConfig, boardId?: string) {
    const service = this.getBoardService(boardType);
    return await service.syncData(config, boardId);
  }
}
